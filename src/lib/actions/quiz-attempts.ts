'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { awardPoints } from '@/lib/actions/gamification'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAuth() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthenticated')
    return session.user
}

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
// Student Actions
// ---------------------------------------------------------------------------

export async function startAttempt(
    quizId: string,
    courseId: string
): Promise<{ success: boolean; error?: string; attemptId?: string }> {
    try {
        const user = await requireAuth()

        // Verify enrollment
        const enrollment = await db.enrollment.findUnique({
            where: { userId_courseId: { userId: user.id!, courseId } },
        })
        if (!enrollment) return { success: false, error: 'Belum terdaftar di kursus ini' }

        // Check quiz exists
        const quiz = await db.quiz.findUnique({
            where: { id: quizId },
            select: { maxAttempts: true },
        })
        if (!quiz) return { success: false, error: 'Quiz tidak ditemukan' }

        // Check attempt limit
        const existingAttempts = await db.quizAttempt.count({
            where: { quizId, enrollmentId: enrollment.id },
        })
        if (existingAttempts >= quiz.maxAttempts) {
            return { success: false, error: `Batas percobaan (${quiz.maxAttempts}x) sudah tercapai` }
        }

        // Create attempt
        const attempt = await db.quizAttempt.create({
            data: {
                quizId,
                enrollmentId: enrollment.id,
            },
            select: { id: true },
        })

        return { success: true, attemptId: attempt.id }
    } catch {
        return { success: false, error: 'Gagal memulai quiz' }
    }
}

export async function submitAttempt(
    attemptId: string,
    answers: { questionId: string; optionId?: string; essayText?: string }[]
): Promise<{ success: boolean; error?: string; score?: number; passed?: boolean }> {
    try {
        const user = await requireAuth()

        // Verify ownership
        const attempt = await db.quizAttempt.findUnique({
            where: { id: attemptId },
            select: {
                id: true,
                submittedAt: true,
                quizId: true,
                enrollment: { select: { userId: true, courseId: true } },
            },
        })
        if (!attempt) return { success: false, error: 'Attempt tidak ditemukan' }
        if (attempt.enrollment.userId !== user.id) return { success: false, error: 'Akses ditolak' }
        if (attempt.submittedAt) return { success: false, error: 'Quiz sudah disubmit' }

        // Get quiz with questions for scoring
        const quiz = await db.quiz.findUnique({
            where: { id: attempt.quizId },
            select: {
                title: true,
                passingScore: true,
                showResult: true,
                questions: {
                    select: {
                        id: true,
                        type: true,
                        points: true,
                        options: {
                            select: { id: true, isCorrect: true },
                        },
                    },
                },
            },
        })
        if (!quiz) return { success: false, error: 'Quiz tidak ditemukan' }

        // Create answers and auto-score MCQ
        let totalPoints = 0
        let earnedPoints = 0
        let hasEssay = false

        const answerData = answers.map((ans) => {
            const question = quiz.questions.find((q) => q.id === ans.questionId)
            if (!question) return null

            totalPoints += question.points

            if (question.type === 'MULTIPLE_CHOICE') {
                const correctOption = question.options.find((o) => o.isCorrect)
                const isCorrect = ans.optionId === correctOption?.id
                const score = isCorrect ? question.points : 0
                earnedPoints += score

                return {
                    attemptId,
                    questionId: ans.questionId,
                    optionId: ans.optionId ?? null,
                    essayText: null,
                    score,
                    feedback: isCorrect ? 'Benar' : 'Salah',
                }
            } else {
                // Essay — score null until graded
                hasEssay = true
                return {
                    attemptId,
                    questionId: ans.questionId,
                    optionId: null,
                    essayText: ans.essayText ?? null,
                    score: null,
                    feedback: null,
                }
            }
        }).filter(Boolean) as {
            attemptId: string
            questionId: string
            optionId: string | null
            essayText: string | null
            score: number | null
            feedback: string | null
        }[]

        await db.attemptAnswer.createMany({ data: answerData })

        // Calculate score (only if no essay questions needing grading)
        const finalScore = hasEssay
            ? null
            : totalPoints > 0
                ? Math.round((earnedPoints / totalPoints) * 100)
                : 0
        const passed = finalScore !== null ? finalScore >= quiz.passingScore : null

        await db.quizAttempt.update({
            where: { id: attemptId },
            data: {
                submittedAt: new Date(),
                score: finalScore,
                passed,
            },
        })

        // Award points if passed
        if (passed && finalScore !== null && finalScore > 0) {
            const pointsToAward = Math.round(finalScore / 2) // Max 50 points
            await awardPoints(user.id!, pointsToAward, `Lulus kuis: ${quiz.title} dengan nilai ${finalScore}`)
        }

        revalidatePath(`/portal/my-courses/${attempt.enrollment.courseId}`)

        return { success: true, score: finalScore ?? undefined, passed: passed ?? undefined }
    } catch {
        return { success: false, error: 'Gagal menyimpan jawaban' }
    }
}

export async function getAttemptResult(attemptId: string) {
    const user = await requireAuth()

    const attempt = await db.quizAttempt.findUnique({
        where: { id: attemptId },
        select: {
            id: true,
            quizId: true,
            score: true,
            passed: true,
            startedAt: true,
            submittedAt: true,
            enrollment: { select: { userId: true } },
            quiz: {
                select: {
                    title: true,
                    passingScore: true,
                    showResult: true,
                },
            },
            answers: {
                select: {
                    id: true,
                    questionId: true,
                    optionId: true,
                    essayText: true,
                    score: true,
                    feedback: true,
                    question: {
                        select: {
                            text: true,
                            type: true,
                            points: true,
                            options: {
                                orderBy: { order: 'asc' },
                                select: { id: true, text: true, isCorrect: true },
                            },
                        },
                    },
                },
            },
        },
    })

    if (!attempt || attempt.enrollment.userId !== user.id) return null

    return attempt
}

export async function getMyAttempts(courseId: string) {
    const user = await requireAuth()

    const enrollment = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id!, courseId } },
        select: { id: true },
    })
    if (!enrollment) return []

    return db.quizAttempt.findMany({
        where: { enrollmentId: enrollment.id },
        orderBy: { startedAt: 'desc' },
        select: {
            id: true,
            quizId: true,
            score: true,
            passed: true,
            startedAt: true,
            submittedAt: true,
            quiz: { select: { title: true, passingScore: true } },
        },
    })
}

// ---------------------------------------------------------------------------
// Grading (Backoffice)
// ---------------------------------------------------------------------------

export async function getEssaysToGrade(quizId: string) {
    await requireWriteAccess()

    return db.attemptAnswer.findMany({
        where: {
            question: { quizId, type: 'ESSAY' },
            score: null,
            attempt: { submittedAt: { not: null } },
        },
        orderBy: { attempt: { submittedAt: 'asc' } },
        select: {
            id: true,
            essayText: true,
            score: true,
            feedback: true,
            question: {
                select: { text: true, points: true },
            },
            attempt: {
                select: {
                    id: true,
                    enrollment: {
                        select: {
                            user: { select: { name: true, email: true } },
                        },
                    },
                },
            },
        },
    })
}

export async function gradeEssay(
    answerId: string,
    score: number,
    feedback: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await requireWriteAccess()

        const answer = await db.attemptAnswer.findUnique({
            where: { id: answerId },
            select: {
                questionId: true,
                question: { select: { points: true } },
                attemptId: true,
            },
        })
        if (!answer) return { success: false, error: 'Jawaban tidak ditemukan' }

        if (score < 0 || score > answer.question.points) {
            return { success: false, error: `Skor harus antara 0 dan ${answer.question.points}` }
        }

        // Update the answer score
        await db.attemptAnswer.update({
            where: { id: answerId },
            data: { score, feedback },
        })

        // Check if all answers in this attempt are now graded
        const ungradedCount = await db.attemptAnswer.count({
            where: { attemptId: answer.attemptId, score: null },
        })

        if (ungradedCount === 0) {
            // All answers graded — recalculate total score
            const allAnswers = await db.attemptAnswer.findMany({
                where: { attemptId: answer.attemptId },
                select: { score: true, question: { select: { points: true } } },
            })

            const totalPoints = allAnswers.reduce((sum, a) => sum + a.question.points, 0)
            const earnedPoints = allAnswers.reduce((sum, a) => sum + (a.score ?? 0), 0)
            const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

            const attempt = await db.quizAttempt.findUnique({
                where: { id: answer.attemptId },
                select: { quiz: { select: { passingScore: true, courseId: true } } },
            })

            await db.quizAttempt.update({
                where: { id: answer.attemptId },
                data: {
                    score: finalScore,
                    passed: attempt ? finalScore >= attempt.quiz.passingScore : false,
                },
            })

            // Award points if essay grading results in passed
            if (attempt && finalScore >= attempt.quiz.passingScore && finalScore > 0) {
                const pointsToAward = Math.round(finalScore / 2)
                const attemptFull = await db.quizAttempt.findUnique({
                    where: { id: answer.attemptId },
                    select: { quiz: { select: { title: true } }, enrollment: { select: { userId: true } } }
                })
                if (attemptFull) {
                    await awardPoints(attemptFull.enrollment.userId, pointsToAward, `Lulus kuis (Essay Graded): ${attemptFull.quiz.title} dengan nilai ${finalScore}`)
                }
            }

            if (attempt) {
                revalidatePath(`/portal/my-courses/${attempt.quiz.courseId}`)
            }
        }

        return { success: true }
    } catch {
        return { success: false, error: 'Gagal menyimpan nilai' }
    }
}
