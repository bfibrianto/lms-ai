'use server';

import { generateContentCompletion, generateCourseDescription, generateLessonContent, generateLessonList, generateModuleList, generateQuizQuestions, gradeEssayAnswer } from '@/lib/ai';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Generates a concise course description (general overview only, max 1000 chars)
 */
export async function generateCourseDescriptionAction(title: string, additionalContext?: string) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized' };
        }
        if (!title || title.trim().length < 3) {
            return { success: false, error: 'Masukkan judul kursus terlebih dahulu (minimal 3 karakter).' };
        }
        const content = await generateCourseDescription(title, additionalContext);
        return { success: true, data: content };
    } catch (error: any) {
        console.error('generateCourseDescriptionAction error:', error);
        return { success: false, error: error.message || 'Gagal menghasilkan deskripsi.' };
    }
}

/**
 * Generates a list of module titles based on course context and optional admin guidelines.
 */
export async function generateModuleListAction(courseId: string, adminGuidelines?: string) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized' };
        }

        const course = await db.course.findUnique({
            where: { id: courseId },
            select: { title: true, description: true },
        });
        if (!course) return { success: false, error: 'Kursus tidak ditemukan.' };
        if (!course.title) return { success: false, error: 'Judul kursus diperlukan.' };

        const modules = await generateModuleList(
            course.title,
            course.description ?? '',
            adminGuidelines
        );
        return { success: true, data: modules };
    } catch (error: any) {
        console.error('generateModuleListAction error:', error);
        return { success: false, error: error.message || 'Gagal generate modul.' };
    }
}

/**
 * Generates a list of lesson titles based on module and course context.
 */
export async function generateLessonListAction(moduleId: string) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized' };
        }

        const module = await db.module.findUnique({
            where: { id: moduleId },
            select: {
                title: true,
                course: { select: { title: true } },
            },
        });
        if (!module) return { success: false, error: 'Modul tidak ditemukan.' };

        const lessons = await generateLessonList(module.title, module.course.title);
        return { success: true, data: lessons };
    } catch (error: any) {
        console.error('generateLessonListAction error:', error);
        return { success: false, error: error.message || 'Gagal generate pelajaran.' };
    }
}

/**
 * Generates content for a lesson and saves it directly to the database.
 * Used by the bulk lesson creation flow when the "generate content" option is checked.
 */
export async function generateAndSaveLessonContentAction(lessonId: string) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized' };
        }

        const lesson = await db.lesson.findUnique({
            where: { id: lessonId },
            select: {
                title: true,
                type: true,
                module: {
                    select: {
                        title: true,
                        course: { select: { title: true } },
                    },
                },
            },
        });
        if (!lesson) return { success: false, error: 'Pelajaran tidak ditemukan.' };
        if (lesson.type !== 'TEXT') return { success: true, data: 'Skipped (bukan tipe TEXT)' };

        const content = await generateLessonContent(
            lesson.title,
            lesson.module.title,
            lesson.module.course.title
        );

        await db.lesson.update({
            where: { id: lessonId },
            data: { content },
        });

        return { success: true, data: content };
    } catch (error: any) {
        console.error('generateAndSaveLessonContentAction error:', error);
        return { success: false, error: error.message || 'Gagal generate konten.' };
    }
}

/**
 * Generates lesson content (returns only, does NOT save to DB).
 * Supports both edit mode (lessonId) and create mode (moduleId + lessonTitle).
 */
export async function generateLessonContentAction(
    lessonId?: string,
    moduleId?: string,
    lessonTitle?: string
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role === 'EMPLOYEE') {
            return { success: false, error: 'Unauthorized' };
        }

        let resolvedTitle = lessonTitle ?? '';
        let moduleTitle = '';
        let courseTitle = '';

        if (lessonId) {
            const lesson = await db.lesson.findUnique({
                where: { id: lessonId },
                select: {
                    title: true,
                    module: {
                        select: {
                            title: true,
                            course: { select: { title: true } },
                        },
                    },
                },
            });
            if (!lesson) return { success: false, error: 'Pelajaran tidak ditemukan.' };
            resolvedTitle = lesson.title;
            moduleTitle = lesson.module.title;
            courseTitle = lesson.module.course.title;
        } else if (moduleId) {
            const module = await db.module.findUnique({
                where: { id: moduleId },
                select: {
                    title: true,
                    course: { select: { title: true } },
                },
            });
            if (!module) return { success: false, error: 'Modul tidak ditemukan.' };
            moduleTitle = module.title;
            courseTitle = module.course.title;
        }

        if (!resolvedTitle || resolvedTitle.trim().length < 2) {
            return { success: false, error: 'Masukkan judul pelajaran terlebih dahulu.' };
        }

        const content = await generateLessonContent(resolvedTitle, moduleTitle, courseTitle);
        return { success: true, data: content };
    } catch (error: any) {
        console.error('generateLessonContentAction error:', error);
        return { success: false, error: error.message || 'Gagal generate konten pelajaran.' };
    }
}

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
