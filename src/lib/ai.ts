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
