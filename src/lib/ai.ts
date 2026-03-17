import { genkit, z, Genkit } from 'genkit';
import { googleAI, gemini } from '@genkit-ai/googleai';
import { openAI } from 'genkitx-openai';
import { anthropic } from 'genkitx-anthropic';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

interface AiClientData {
    ai: Genkit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Genkit accepts ModelReference | string
    model: any;
}

/**
 * Retrieves the Genkit instance initialized with the active provider plugin and API key.
 * Now queries the AiProvider table instead of settings.
 */
export async function getAiClient(): Promise<AiClientData> {
    // 1. Get the active provider
    const activeProvider = await db.aiProvider.findFirst({
        where: { isActive: true }
    });

    if (activeProvider) {
        const apiKey = decrypt(activeProvider.apiKey);
        const modelId = activeProvider.model;

        let plugin;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolvedModel: any;

        switch (activeProvider.provider) {
            case 'GEMINI':
                plugin = googleAI({ apiKey });
                resolvedModel = gemini(modelId); // ModelReference for native JSON mode
                break;
            case 'OPENAI':
                plugin = openAI({ apiKey });
                resolvedModel = `openai/${modelId}`;
                break;
            case 'ANTHROPIC':
                plugin = anthropic({ apiKey });
                resolvedModel = `anthropic/${modelId}`;
                break;
            case 'DEEPSEEK':
                // DeepSeek is OpenAI compatible
                plugin = openAI({
                    apiKey,
                    baseURL: 'https://api.deepseek.com/v1'
                });
                resolvedModel = `openai/${modelId}`;
                break;
            default:
                throw new Error(`Unsupported AI provider: ${activeProvider.provider}`);
        }

        const ai = genkit({ plugins: [plugin] });
        return { ai, model: resolvedModel };
    }

    // 2. Fallback to Setting (Backward Compatibility)
    const apiKeySetting = await db.setting.findUnique({
        where: { key: 'GEMINI_API_KEY' },
    });

    const fallbackApiKey = apiKeySetting?.value || process.env.GEMINI_API_KEY;

    if (!fallbackApiKey) {
        throw new Error('AI provider belum dikonfigurasi. Silakan atur di Pengaturan > Integrasi AI.');
    }

    // Default fallback is Gemini — use gemini() for proper ModelReference
    const ai = genkit({
        plugins: [googleAI({ apiKey: fallbackApiKey })],
    });

    return { ai, model: gemini('gemini-2.5-flash') };
}

/**
 * Helper to fetch a custom prompt from settings, falling back to a default value.
 */
export async function getPromptSetting(key: string, defaultValue: string): Promise<string> {
    const setting = await db.setting.findUnique({
        where: { key },
    });
    return setting?.value || defaultValue;
}

// ─── AI Helper Functions ──────────────────────────────────────────────────

export async function generateContentCompletion(prompt: string, context?: string) {
    const { ai, model } = await getAiClient();

    const systemPrompt = await getPromptSetting(
        'PROMPT_CONTENT_GENERATION',
        'You are an expert LMS content creator. Generate engaging, informative, and structurally well-formatted markdown content based on the user request.'
    );

    let fullPrompt = `${systemPrompt}\n\n`;
    if (context) {
        fullPrompt += `Context/Background:\n${context}\n\n`;
    }
    fullPrompt += `User Request: ${prompt}`;

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        config: {
            temperature: 0.7,
        }
    });

    return response.text;
}

export async function generateCourseDescription(title: string, additionalContext?: string): Promise<string> {
    const { ai, model } = await getAiClient();
    const systemPrompt = await getPromptSetting(
        'PROMPT_COURSE_DESCRIPTION',
        `You are an LMS content assistant. Generate a concise, engaging course description 
(general overview only — no syllabus, no module list, no lesson breakdown). 
The description MUST be written in Bahasa Indonesia, in markdown format 
(bold for emphasis, or bullet for key benefits if needed), 
and MUST NOT exceed 1000 characters total.`
    );

    let fullPrompt = `${systemPrompt}\n\nCourse Title: "${title}"`;
    if (additionalContext) {
        fullPrompt += `\n\nAdditional context: ${additionalContext}`;
    }

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        config: { temperature: 0.7, maxOutputTokens: 2000 },
    });

    let text = response.text;
    if (text.length > 5000) {
        text = text.substring(0, 997) + '...';
    }
    return text;
}

const ModuleListSchema = z.array(z.object({
    title: z.string().describe('Judul modul pembelajaran'),
}));

export async function generateModuleList(
    courseTitle: string,
    courseDescription: string,
    adminGuidelines?: string
): Promise<Array<{ title: string }>> {
    const { ai, model } = await getAiClient();
    const systemPrompt = await getPromptSetting(
        'PROMPT_MODULE_GENERATION',
        `Kamu adalah asisten pembuatan kurikulum LMS. Berdasarkan judul dan deskripsi kursus yang diberikan, 
generate daftar modul pembelajaran yang logis, terstruktur, dan komprehensif.
Output hanya berupa array JSON dengan field "title" untuk setiap modul.
Jumlah modul yang ideal adalah antara 4-8 modul, kecuali jika ada arahan spesifik.
Judul modul ditulis dalam Bahasa Indonesia.`
    );

    let fullPrompt = `${systemPrompt}\n\nJudul Kursus: "${courseTitle}"\nDeskripsi Kursus: "${courseDescription}"`;
    if (adminGuidelines) {
        fullPrompt += `\n\nArahan dari Admin: ${adminGuidelines}`;
    }

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        output: { schema: ModuleListSchema },
        config: { temperature: 0.6 },
    });

    if (!response.output) throw new Error('Gagal menghasilkan list modul.');
    return response.output;
}

const LessonListSchema = z.array(z.object({
    title: z.string().describe('Judul pelajaran'),
    type: z.enum(['TEXT', 'VIDEO', 'DOCUMENT']).describe('Tipe pelajaran default').default('TEXT'),
}));

export async function generateLessonList(
    moduleTitle: string,
    courseTitle: string,
    adminGuidelines?: string
): Promise<Array<{ title: string; type: 'TEXT' | 'VIDEO' | 'DOCUMENT' }>> {
    const { ai, model } = await getAiClient();
    const systemPrompt = await getPromptSetting(
        'PROMPT_LESSON_GENERATION',
        `Kamu adalah asisten pembuatan kurikulum LMS. Berdasarkan judul modul yang diberikan,
generate daftar pelajaran yang logis dan komprehensif untuk modul tersebut.
Idealnya 3-6 pelajaran per modul. Judul pelajaran ditulis dalam Bahasa Indonesia.
Tentukan tipe pelajaran (TEXT untuk konten teks, VIDEO untuk konten video, DOCUMENT untuk dokumen).
Default ke TEXT jika tidak ada konteks yang jelas.`
    );

    let fullPrompt = `${systemPrompt}\n\nJudul Kursus: "${courseTitle}"\nJudul Modul: "${moduleTitle}"`;
    if (adminGuidelines?.trim()) {
        fullPrompt += `\n\nArahan tambahan dari Admin: ${adminGuidelines.trim()}`;
    }

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        output: { schema: LessonListSchema },
        config: { temperature: 0.6 },
    });

    if (!response.output) throw new Error('Gagal menghasilkan list pelajaran.');
    return response.output;
}

export async function generateLessonContent(
    lessonTitle: string,
    moduleTitle: string,
    courseTitle: string
): Promise<string> {
    const { ai, model } = await getAiClient();
    const systemPrompt = await getPromptSetting(
        'PROMPT_LESSON_CONTENT',
        `Kamu adalah mesin pembuat konten pelatihan LMS yang dipanggil oleh sistem otomatis (bukan manusia).
JANGAN menambahkan sapaan, greeting, atau kalimat pembuka seperti "Tentu saja", "Berikut adalah", "Baik", dsb.
Langsung tulis konten pelajaran tanpa basa-basi.

Buat konten pelajaran yang komprehensif, terstruktur, dan engaging dalam format Markdown.
Konten harus mencakup: penjelasan konsep, contoh praktis, dan ringkasan atau poin-poin kunci.
Gunakan heading (##, ###), bullet list, bold untuk istilah penting, dan code block jika relevan.
Konten ditulis dalam Bahasa Indonesia. Gunakan maksimal 5000 token agar konten tidak terpotong.`
    );

    const fullPrompt = `${systemPrompt}\n\nKursus: "${courseTitle}"\nModul: "${moduleTitle}"\nJudul Pelajaran: "${lessonTitle}"\n\nLangsung tulis konten pelajaran lengkap:`;

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        config: { temperature: 0.7, maxOutputTokens: 5000 },
    });

    return response.text;
}

const QuizQuestionSchema = z.array(z.object({
    text: z.string(),
    points: z.number().default(1),
    options: z.array(z.object({
        text: z.string(),
        isCorrect: z.boolean()
    }))
}));

export async function generateQuizQuestions(topic: string, count: number = 5, context?: string) {
    const { ai, model } = await getAiClient();

    const systemPrompt = await getPromptSetting(
        'PROMPT_QUIZ_GENERATION',
        'You are an expert educational assessor. Generate multiple choice questions exactly matching the requested schema. Provide exactly 4 options per question with 1 correct answer.'
    );

    let fullPrompt = `${systemPrompt}\n\nGenerate ${count} multiple choice questions about "${topic}".\n\n`;
    if (context) {
        fullPrompt += `Use the following context as the basis for the questions:\n${context}\n\n`;
    }

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        output: { schema: QuizQuestionSchema },
        config: {
            temperature: 0.5,
        }
    });

    if (!response.output) {
        throw new Error('Gagal menghasilkan format soal kuis yang valid dari AI.');
    }

    return response.output;
}

// ─── Context-Aware Quiz Generation (TASK-026) ────────────────────────────────

const MultipleChoiceQuestionSchema = z.object({
    type: z.enum(['MULTIPLE_CHOICE']),
    text: z.string().describe('Teks pertanyaan'),
    points: z.number().default(1),
    explanation: z.string().optional().describe('Penjelasan mengapa jawaban tersebut benar'),
    options: z.array(z.object({
        text: z.string().describe('Teks pilihan jawaban'),
        isCorrect: z.boolean().describe('Apakah pilihan ini jawaban yang benar'),
    })).min(3).max(5).describe('Minimal 3, maksimal 5 pilihan jawaban. Tepat 1 isCorrect = true'),
})

const EssayQuestionContextSchema = z.object({
    type: z.enum(['ESSAY']),
    text: z.string().describe('Teks pertanyaan essay'),
    points: z.number().default(5),
    rubric: z.string().optional().describe('Rubrik atau panduan penilaian jawaban essay'),
})

const GeneratedQuestionSchema = z.discriminatedUnion('type', [
    MultipleChoiceQuestionSchema,
    EssayQuestionContextSchema,
])

const GeneratedQuizOutputSchema = z.object({
    questions: z.array(GeneratedQuestionSchema),
})

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>

export interface GenerateQuizQuestionsWithContextParams {
    quizTitle: string
    courseTitle: string
    context: string
    count: number
    questionTypes: Array<'MULTIPLE_CHOICE' | 'ESSAY'>
}

export async function generateQuizQuestionsWithContext(
    params: GenerateQuizQuestionsWithContextParams
): Promise<GeneratedQuestion[]> {
    const { quizTitle, courseTitle, context, count, questionTypes } = params
    const { ai, model } = await getAiClient()

    const systemPrompt = await getPromptSetting(
        'PROMPT_QUIZ_GENERATION_CONTEXT',
        `Kamu adalah pakar pembuatan soal evaluasi untuk platform LMS.
Tugasmu adalah membuat soal quiz yang relevan, akurat, dan mengukur pemahaman peserta
berdasarkan konteks materi yang diberikan.

KETENTUAN WAJIB:
- Buat soal HANYA berdasarkan materi dalam "KONTEKS MATERI" yang diberikan.
- Jangan tambahkan pengetahuan di luar konteks tersebut.
- Untuk MULTIPLE_CHOICE: buat tepat 4 pilihan jawaban, tepat 1 yang benar (isCorrect: true), sertakan explanation.
- Untuk ESSAY: buat pertanyaan terbuka yang mendorong analisis mendalam, sertakan rubric penilaian.
- Soal ditulis dalam Bahasa Indonesia yang jelas dan tidak ambigu.
- Variasikan tingkat kesulitan (mudah, sedang, sulit).
- Output harus berupa JSON sesuai schema yang diminta.
- JANGAN menambahkan sapaan atau teks di luar JSON output.`
    )

    const typeInstruction = questionTypes.length === 2
        ? `Buat campuran soal MULTIPLE_CHOICE dan ESSAY secara proporsional (sekitar 70% MULTIPLE_CHOICE, 30% ESSAY).`
        : `Buat semua soal bertipe ${questionTypes[0]}.`

    const fullPrompt = `${systemPrompt}

JUDUL KURSUS: "${courseTitle}"
JUDUL QUIZ: "${quizTitle}"
JUMLAH SOAL YANG DIMINTA: ${count}
TIPE SOAL: ${typeInstruction}

--- KONTEKS MATERI ---
${context}
--- AKHIR KONTEKS MATERI ---

Hasilkan tepat ${count} soal quiz berdasarkan konteks materi di atas.`

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        output: { schema: GeneratedQuizOutputSchema },
        config: { temperature: 0.5, maxOutputTokens: 4096 },
    })

    if (!response.output) throw new Error('Gagal menghasilkan soal quiz.')
    return response.output.questions
}

const EssayScoreSchema = z.object({
    score: z.number().describe("Integer score from 0-100"),
    feedback: z.string().describe("Explanation for the score")
});

export async function gradeEssayAnswer(questionText: string, studentAnswer: string) {
    const { ai, model } = await getAiClient();

    const systemPrompt = await getPromptSetting(
        'PROMPT_ESSAY_GRADING',
        'You are a strict but fair teacher grading an essay answer. You will output a score (integer 0-100) and feedback explaining the score.'
    );

    const fullPrompt = `${systemPrompt}\n\nQuestion: ${questionText}\n\nStudent Answer:\n${studentAnswer}\n\nPlease grade this answer.`;

    const response = await ai.generate({
        model,
        prompt: fullPrompt,
        output: { schema: EssayScoreSchema },
        config: {
            temperature: 0.3,
        }
    });

    if (!response.output) {
        throw new Error('Gagal mengurai nilai essay dari AI.');
    }

    return {
        score: response.output.score,
        feedback: response.output.feedback
    };
}
