import { genkit, z } from 'genkit';
import { googleAI, gemini } from '@genkit-ai/googleai';
import { db } from '@/lib/db';

/**
 * Retrieves the Genkit instance initialized with the Google AI plugin and 
 * API key from settings or env.
 */
export async function getGenkitClient() {
    // First try from DB settings
    const apiKeySetting = await db.setting.findUnique({
        where: { key: 'GEMINI_API_KEY' },
    });

    const apiKey = apiKeySetting?.value || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API Key is not configured in Settings or Environment Variables.');
    }

    // Initialize Genkit
    const ai = genkit({
        plugins: [googleAI({ apiKey })],
    });

    return ai;
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
    const ai = await getGenkitClient();

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
        model: gemini('gemini-2.5-flash'),
        prompt: fullPrompt,
        config: {
            temperature: 0.7,
        }
    });

    return response.text;
}

export async function generateCourseDescription(title: string, additionalContext?: string): Promise<string> {
    const ai = await getGenkitClient();
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
        model: gemini('gemini-2.5-flash'),
        prompt: fullPrompt,
        config: { temperature: 0.7, maxOutputTokens: 2000 },
    });

    let text = response.text;
    // Enforce 5000 char server-side trimming
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
    const ai = await getGenkitClient();
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
        model: gemini('gemini-2.5-flash'),
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
    courseTitle: string
): Promise<Array<{ title: string; type: 'TEXT' | 'VIDEO' | 'DOCUMENT' }>> {
    const ai = await getGenkitClient();
    const systemPrompt = await getPromptSetting(
        'PROMPT_LESSON_GENERATION',
        `Kamu adalah asisten pembuatan kurikulum LMS. Berdasarkan judul modul yang diberikan,
generate daftar pelajaran yang logis dan komprehensif untuk modul tersebut.
Idealnya 3-6 pelajaran per modul. Judul pelajaran ditulis dalam Bahasa Indonesia.
Tentukan tipe pelajaran (TEXT untuk konten teks, VIDEO untuk konten video, DOCUMENT untuk dokumen).
Default ke TEXT jika tidak ada konteks yang jelas.`
    );

    const fullPrompt = `${systemPrompt}\n\nJudul Kursus: "${courseTitle}"\nJudul Modul: "${moduleTitle}"`;

    const response = await ai.generate({
        model: gemini('gemini-2.5-flash'),
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
    const ai = await getGenkitClient();
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
        model: gemini('gemini-2.5-flash'),
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
    const ai = await getGenkitClient();

    const systemPrompt = await getPromptSetting(
        'PROMPT_QUIZ_GENERATION',
        'You are an expert educational assessor. Generate multiple choice questions exactly matching the requested schema. Provide exactly 4 options per question with 1 correct answer.'
    );

    let fullPrompt = `${systemPrompt}\n\nGenerate ${count} multiple choice questions about "${topic}".\n\n`;
    if (context) {
        fullPrompt += `Use the following context as the basis for the questions:\n${context}\n\n`;
    }

    const response = await ai.generate({
        model: gemini('gemini-2.5-flash'),
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

const EssayScoreSchema = z.object({
    score: z.number().describe("Integer score from 0-100"),
    feedback: z.string().describe("Explanation for the score")
});

export async function gradeEssayAnswer(questionText: string, studentAnswer: string) {
    const ai = await getGenkitClient();

    const systemPrompt = await getPromptSetting(
        'PROMPT_ESSAY_GRADING',
        'You are a strict but fair teacher grading an essay answer. You will output a score (integer 0-100) and feedback explaining the score.'
    );

    const fullPrompt = `${systemPrompt}\n\nQuestion: ${questionText}\n\nStudent Answer:\n${studentAnswer}\n\nPlease grade this answer.`;

    const response = await ai.generate({
        model: gemini('gemini-2.5-flash'),
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
