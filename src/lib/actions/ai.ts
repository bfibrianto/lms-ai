'use server';

import { generateContentCompletion, generateQuizQuestions, gradeEssayAnswer } from '@/lib/ai';
import { auth } from '@/lib/auth';

/**
 * Generates text content using OpenAI based on a provided prompt and optional context.
 */
export async function generateContentAction(prompt: string, context?: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Optional: Check role to limit AI usage to Staff/Mentor/Admin
        if (session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Forbidden. Only administrators or mentors can use this feature.' };
        }

        const content = await generateContentCompletion(prompt, context);
        return { success: true, data: content };
    } catch (error: any) {
        console.error('generateContentAction error:', error);
        return { success: false, error: error.message || 'Gagal menghasilkan konten AI.' };
    }
}

/**
 * Generates a set of multiple-choice quiz questions based on a topic and optional context.
 */
export async function generateQuizAction(topic: string, count: number = 5, context?: string) {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized/Forbidden' };
        }

        const questions = await generateQuizQuestions(topic, count, context);
        return { success: true, data: questions };
    } catch (error: any) {
        console.error('generateQuizAction error:', error);
        return { success: false, error: error.message || 'Gagal menghasilkan soal kuis dari AI.' };
    }
}

/**
 * Used for automated essay grading. Suggests a score (0-100) and feedback for a student's text.
 */
export async function suggestEssayScoreAction(questionText: string, studentAnswer: string) {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized/Forbidden' };
        }

        const result = await gradeEssayAnswer(questionText, studentAnswer);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('suggestEssayScoreAction error:', error);
        return { success: false, error: error.message || 'Gagal menilai essay.' };
    }
}
