'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateQuizSchema, QuestionSchema } from '@/lib/validations/quizzes'

// ---------------------------------------------------------------------------
// Access Control
// ---------------------------------------------------------------------------

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'] as const

async function requireWriteAccess() {
    const session = await auth()
    if (!session?.user) throw new Error('Tidak terautentikasi')
    if (!(WRITE_ROLES as readonly string[]).includes(session.user.role)) {
        throw new Error('Akses ditolak')
    }
    return session
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getQuizzesByCourse(courseId: string) {
    return db.quiz.findMany({
        where: { courseId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            description: true,
            passingScore: true,
            duration: true,
            maxAttempts: true,
            createdAt: true,
            _count: { select: { questions: true, attempts: true } },
        },
    })
}

export async function getQuizDetail(quizId: string) {
    return db.quiz.findUnique({
        where: { id: quizId },
        select: {
            id: true,
            courseId: true,
            title: true,
            description: true,
            passingScore: true,
            duration: true,
            maxAttempts: true,
            shuffleQuestions: true,
            showResult: true,
            questions: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    quizId: true,
                    type: true,
                    text: true,
                    points: true,
                    order: true,
                    options: {
                        orderBy: { order: 'asc' },
                        select: {
                            id: true,
                            text: true,
                            isCorrect: true,
                            order: true,
                        },
                    },
                },
            },
            _count: { select: { attempts: true } },
        },
    })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createQuiz(
    courseId: string,
    formData: FormData
): Promise<{ success: boolean; error?: string; data?: { id: string } }> {
    await requireWriteAccess()

    const raw = {
        title: formData.get('title'),
        description: formData.get('description'),
        passingScore: formData.get('passingScore'),
        duration: formData.get('duration'),
        maxAttempts: formData.get('maxAttempts'),
        shuffleQuestions: formData.get('shuffleQuestions'),
        showResult: formData.get('showResult'),
    }

    const parsed = CreateQuizSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const quiz = await db.quiz.create({
        data: {
            courseId,
            title: parsed.data.title,
            description: parsed.data.description || null,
            passingScore: parsed.data.passingScore,
            duration: parsed.data.duration ?? null,
            maxAttempts: parsed.data.maxAttempts,
            shuffleQuestions: parsed.data.shuffleQuestions,
            showResult: parsed.data.showResult,
        },
        select: { id: true },
    })

    revalidatePath(`/backoffice/courses/${courseId}`)
    return { success: true, data: { id: quiz.id } }
}

export async function updateQuiz(
    quizId: string,
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    await requireWriteAccess()

    const raw = {
        title: formData.get('title'),
        description: formData.get('description'),
        passingScore: formData.get('passingScore'),
        duration: formData.get('duration'),
        maxAttempts: formData.get('maxAttempts'),
        shuffleQuestions: formData.get('shuffleQuestions'),
        showResult: formData.get('showResult'),
    }

    const parsed = CreateQuizSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const quiz = await db.quiz.update({
        where: { id: quizId },
        data: {
            title: parsed.data.title,
            description: parsed.data.description || null,
            passingScore: parsed.data.passingScore,
            duration: parsed.data.duration ?? null,
            maxAttempts: parsed.data.maxAttempts,
            shuffleQuestions: parsed.data.shuffleQuestions,
            showResult: parsed.data.showResult,
        },
        select: { courseId: true },
    })

    revalidatePath(`/backoffice/courses/${quiz.courseId}`)
    return { success: true }
}

export async function deleteQuiz(
    quizId: string
): Promise<{ success: boolean; error?: string }> {
    await requireWriteAccess()

    const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        select: { courseId: true },
    })
    if (!quiz) return { success: false, error: 'Quiz tidak ditemukan' }

    await db.quiz.delete({ where: { id: quizId } })

    revalidatePath(`/backoffice/courses/${quiz.courseId}`)
    return { success: true }
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export async function addQuestion(
    quizId: string,
    data: { type: string; text: string; points: number; options?: { text: string; isCorrect: boolean }[] }
): Promise<{ success: boolean; error?: string }> {
    await requireWriteAccess()

    const parsed = QuestionSchema.safeParse(data)
    if (!parsed.success) {
        return { success: false, error: 'Data soal tidak valid' }
    }

    // Get next order
    const lastQuestion = await db.question.findFirst({
        where: { quizId },
        orderBy: { order: 'desc' },
        select: { order: true },
    })
    const nextOrder = (lastQuestion?.order ?? -1) + 1

    await db.question.create({
        data: {
            quizId,
            type: parsed.data.type as 'MULTIPLE_CHOICE' | 'ESSAY',
            text: parsed.data.text,
            points: parsed.data.points,
            order: nextOrder,
            ...(parsed.data.type === 'MULTIPLE_CHOICE' && parsed.data.options
                ? {
                    options: {
                        create: parsed.data.options.map((opt, idx) => ({
                            text: opt.text,
                            isCorrect: opt.isCorrect,
                            order: idx,
                        })),
                    },
                }
                : {}),
        },
    })

    const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        select: { courseId: true },
    })
    if (quiz) revalidatePath(`/backoffice/courses/${quiz.courseId}`)
    return { success: true }
}

export async function updateQuestion(
    questionId: string,
    data: { type: string; text: string; points: number; options?: { text: string; isCorrect: boolean }[] }
): Promise<{ success: boolean; error?: string }> {
    await requireWriteAccess()

    const parsed = QuestionSchema.safeParse(data)
    if (!parsed.success) {
        return { success: false, error: 'Data soal tidak valid' }
    }

    // Delete existing options, re-create
    await db.questionOption.deleteMany({ where: { questionId } })

    await db.question.update({
        where: { id: questionId },
        data: {
            type: parsed.data.type as 'MULTIPLE_CHOICE' | 'ESSAY',
            text: parsed.data.text,
            points: parsed.data.points,
            ...(parsed.data.type === 'MULTIPLE_CHOICE' && parsed.data.options
                ? {
                    options: {
                        create: parsed.data.options.map((opt, idx) => ({
                            text: opt.text,
                            isCorrect: opt.isCorrect,
                            order: idx,
                        })),
                    },
                }
                : {}),
        },
    })

    const question = await db.question.findUnique({
        where: { id: questionId },
        select: { quiz: { select: { courseId: true } } },
    })
    if (question) revalidatePath(`/backoffice/courses/${question.quiz.courseId}`)
    return { success: true }
}

export async function deleteQuestion(
    questionId: string
): Promise<{ success: boolean; error?: string }> {
    await requireWriteAccess()

    const question = await db.question.findUnique({
        where: { id: questionId },
        select: { quiz: { select: { courseId: true } } },
    })
    if (!question) return { success: false, error: 'Soal tidak ditemukan' }

    await db.question.delete({ where: { id: questionId } })

    revalidatePath(`/backoffice/courses/${question.quiz.courseId}`)
    return { success: true }
}

export async function reorderQuestions(
    quizId: string,
    questionIds: string[]
): Promise<{ success: boolean; error?: string }> {
    await requireWriteAccess()

    await db.$transaction(
        questionIds.map((id, idx) =>
            db.question.update({
                where: { id },
                data: { order: idx },
            })
        )
    )

    const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        select: { courseId: true },
    })
    if (quiz) revalidatePath(`/backoffice/courses/${quiz.courseId}`)
    return { success: true }
}
