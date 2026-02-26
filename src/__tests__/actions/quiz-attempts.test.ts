import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// Mock auth
const mockAuth = vi.fn()
vi.mock('@/lib/auth', () => ({
    auth: () => mockAuth(),
}))

// Mock db
const mockDb = {
    enrollment: {
        findUnique: vi.fn(),
    },
    quiz: {
        findUnique: vi.fn(),
    },
    quizAttempt: {
        count: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
    },
    attemptAnswer: {
        createMany: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
    },
}

vi.mock('@/lib/db', () => ({
    db: mockDb,
}))

// Import after mocks
const {
    startAttempt,
    submitAttempt,
    getAttemptResult,
    getMyAttempts,
    gradeEssay,
} = await import('@/lib/actions/quiz-attempts')

const USER = { id: 'user-1', role: 'EMPLOYEE' }
const ADMIN = { id: 'admin-1', role: 'HR_ADMIN' }

// ─── startAttempt ───────────────────────────────────────────

describe('startAttempt', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('creates a new attempt when within limit', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.quiz.findUnique.mockResolvedValue({ maxAttempts: 3 })
        mockDb.quizAttempt.count.mockResolvedValue(1) // 1 of 3 used
        mockDb.quizAttempt.create.mockResolvedValue({ id: 'attempt-1' })

        const result = await startAttempt('quiz-1', 'course-1')

        expect(result.success).toBe(true)
        expect(result.attemptId).toBe('attempt-1')
    })

    it('rejects when max attempts reached', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.quiz.findUnique.mockResolvedValue({ maxAttempts: 2 })
        mockDb.quizAttempt.count.mockResolvedValue(2) // 2 of 2 used

        const result = await startAttempt('quiz-1', 'course-1')

        expect(result.success).toBe(false)
        expect(result.error).toContain('Batas percobaan')
    })

    it('rejects if not enrolled', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue(null)

        const result = await startAttempt('quiz-1', 'course-1')

        expect(result.success).toBe(false)
        expect(result.error).toContain('Belum terdaftar')
    })

    it('rejects if quiz not found', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.quiz.findUnique.mockResolvedValue(null)

        const result = await startAttempt('fake', 'course-1')

        expect(result.success).toBe(false)
        expect(result.error).toContain('tidak ditemukan')
    })

    it('rejects if not authenticated', async () => {
        mockAuth.mockResolvedValue(null)

        const result = await startAttempt('quiz-1', 'course-1')
        expect(result.success).toBe(false)
    })
})

// ─── submitAttempt ──────────────────────────────────────────

describe('submitAttempt', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('auto-scores MCQ and calculates passing score', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            id: 'att-1',
            submittedAt: null,
            quizId: 'quiz-1',
            enrollment: { userId: 'user-1', courseId: 'course-1' },
        })
        mockDb.quiz.findUnique.mockResolvedValue({
            passingScore: 60,
            showResult: true,
            questions: [
                {
                    id: 'q1',
                    type: 'MULTIPLE_CHOICE',
                    points: 10,
                    options: [
                        { id: 'o1', isCorrect: true },
                        { id: 'o2', isCorrect: false },
                    ],
                },
                {
                    id: 'q2',
                    type: 'MULTIPLE_CHOICE',
                    points: 10,
                    options: [
                        { id: 'o3', isCorrect: false },
                        { id: 'o4', isCorrect: true },
                    ],
                },
            ],
        })
        mockDb.attemptAnswer.createMany.mockResolvedValue({})
        mockDb.quizAttempt.update.mockResolvedValue({})

        const result = await submitAttempt('att-1', [
            { questionId: 'q1', optionId: 'o1' }, // correct
            { questionId: 'q2', optionId: 'o3' }, // wrong
        ])

        expect(result.success).toBe(true)
        expect(result.score).toBe(50) // 10/20 = 50%
        expect(result.passed).toBe(false) // 50 < 60
    })

    it('scores 100% when all MCQ correct', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            id: 'att-1',
            submittedAt: null,
            quizId: 'quiz-1',
            enrollment: { userId: 'user-1', courseId: 'course-1' },
        })
        mockDb.quiz.findUnique.mockResolvedValue({
            passingScore: 70,
            showResult: true,
            questions: [
                {
                    id: 'q1',
                    type: 'MULTIPLE_CHOICE',
                    points: 5,
                    options: [{ id: 'o1', isCorrect: true }],
                },
            ],
        })
        mockDb.attemptAnswer.createMany.mockResolvedValue({})
        mockDb.quizAttempt.update.mockResolvedValue({})

        const result = await submitAttempt('att-1', [
            { questionId: 'q1', optionId: 'o1' },
        ])

        expect(result.score).toBe(100)
        expect(result.passed).toBe(true)
    })

    it('defers score when quiz has essay questions', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            id: 'att-1',
            submittedAt: null,
            quizId: 'quiz-1',
            enrollment: { userId: 'user-1', courseId: 'course-1' },
        })
        mockDb.quiz.findUnique.mockResolvedValue({
            passingScore: 70,
            showResult: true,
            questions: [
                {
                    id: 'q1',
                    type: 'MULTIPLE_CHOICE',
                    points: 5,
                    options: [{ id: 'o1', isCorrect: true }],
                },
                {
                    id: 'q2',
                    type: 'ESSAY',
                    points: 10,
                    options: [],
                },
            ],
        })
        mockDb.attemptAnswer.createMany.mockResolvedValue({})
        mockDb.quizAttempt.update.mockResolvedValue({})

        const result = await submitAttempt('att-1', [
            { questionId: 'q1', optionId: 'o1' },
            { questionId: 'q2', essayText: 'Jawaban essay saya' },
        ])

        expect(result.success).toBe(true)
        expect(result.score).toBeUndefined() // null → undefined
        expect(result.passed).toBeUndefined()
    })

    it('rejects already submitted attempt', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            id: 'att-1',
            submittedAt: new Date(),
            quizId: 'quiz-1',
            enrollment: { userId: 'user-1', courseId: 'course-1' },
        })

        const result = await submitAttempt('att-1', [])

        expect(result.success).toBe(false)
        expect(result.error).toContain('sudah disubmit')
    })

    it('rejects if attempt not owned by user', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            id: 'att-1',
            submittedAt: null,
            quizId: 'quiz-1',
            enrollment: { userId: 'other-user', courseId: 'course-1' },
        })

        const result = await submitAttempt('att-1', [])

        expect(result.success).toBe(false)
        expect(result.error).toContain('Akses ditolak')
    })

    it('rejects if attempt not found', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue(null)

        const result = await submitAttempt('fake', [])

        expect(result.success).toBe(false)
    })
})

// ─── getAttemptResult ───────────────────────────────────────

describe('getAttemptResult', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('returns attempt result for owned attempt', async () => {
        const mockResult = {
            id: 'att-1',
            score: 80,
            enrollment: { userId: 'user-1' },
            answers: [],
        }
        mockDb.quizAttempt.findUnique.mockResolvedValue(mockResult)

        const result = await getAttemptResult('att-1')

        expect(result).toEqual(mockResult)
    })

    it('returns null for attempt owned by another user', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            id: 'att-1',
            enrollment: { userId: 'other' },
        })

        const result = await getAttemptResult('att-1')
        expect(result).toBeNull()
    })

    it('returns null for nonexistent attempt', async () => {
        mockDb.quizAttempt.findUnique.mockResolvedValue(null)

        const result = await getAttemptResult('fake')
        expect(result).toBeNull()
    })
})

// ─── getMyAttempts ──────────────────────────────────────────

describe('getMyAttempts', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('returns attempts for enrolled user', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        const mockAttempts = [
            { id: 'a1', score: 80, passed: true },
            { id: 'a2', score: 50, passed: false },
        ]
        mockDb.quizAttempt.findMany.mockResolvedValue(mockAttempts)

        const result = await getMyAttempts('course-1')

        expect(result).toEqual(mockAttempts)
    })

    it('returns empty array if not enrolled', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue(null)

        const result = await getMyAttempts('course-1')
        expect(result).toEqual([])
    })
})

// ─── gradeEssay ─────────────────────────────────────────────

describe('gradeEssay', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('grades essay answer successfully', async () => {
        mockDb.attemptAnswer.findUnique.mockResolvedValue({
            questionId: 'q1',
            question: { points: 10 },
            attemptId: 'att-1',
        })
        mockDb.attemptAnswer.update.mockResolvedValue({})
        mockDb.attemptAnswer.count.mockResolvedValue(1) // still 1 ungraded

        const result = await gradeEssay('ans-1', 8, 'Jawaban bagus')

        expect(result.success).toBe(true)
        expect(mockDb.attemptAnswer.update).toHaveBeenCalledWith({
            where: { id: 'ans-1' },
            data: { score: 8, feedback: 'Jawaban bagus' },
        })
    })

    it('recalculates total when all answers graded', async () => {
        mockDb.attemptAnswer.findUnique.mockResolvedValue({
            questionId: 'q1',
            question: { points: 10 },
            attemptId: 'att-1',
        })
        mockDb.attemptAnswer.update.mockResolvedValue({})
        mockDb.attemptAnswer.count.mockResolvedValue(0) // no more ungraded
        mockDb.attemptAnswer.findMany.mockResolvedValue([
            { score: 8, question: { points: 10 } }, // MCQ or graded essay
            { score: 7, question: { points: 10 } }, // this essay
        ])
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            quiz: { passingScore: 70, courseId: 'c1' },
        })
        mockDb.quizAttempt.update.mockResolvedValue({})

        const result = await gradeEssay('ans-1', 7, 'Cukup baik')

        expect(result.success).toBe(true)
        // 15/20 = 75% → passed (≥70)
        expect(mockDb.quizAttempt.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    score: 75,
                    passed: true,
                }),
            })
        )
    })

    it('sets passed=false when total below passing score', async () => {
        mockDb.attemptAnswer.findUnique.mockResolvedValue({
            questionId: 'q1',
            question: { points: 10 },
            attemptId: 'att-1',
        })
        mockDb.attemptAnswer.update.mockResolvedValue({})
        mockDb.attemptAnswer.count.mockResolvedValue(0)
        mockDb.attemptAnswer.findMany.mockResolvedValue([
            { score: 3, question: { points: 10 } },
            { score: 2, question: { points: 10 } },
        ])
        mockDb.quizAttempt.findUnique.mockResolvedValue({
            quiz: { passingScore: 70, courseId: 'c1' },
        })
        mockDb.quizAttempt.update.mockResolvedValue({})

        await gradeEssay('ans-1', 2, 'Kurang')

        // 5/20 = 25% → failed
        expect(mockDb.quizAttempt.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    score: 25,
                    passed: false,
                }),
            })
        )
    })

    it('rejects score exceeding max points', async () => {
        mockDb.attemptAnswer.findUnique.mockResolvedValue({
            questionId: 'q1',
            question: { points: 10 },
            attemptId: 'att-1',
        })

        const result = await gradeEssay('ans-1', 11, '')

        expect(result.success).toBe(false)
        expect(result.error).toContain('0 dan 10')
    })

    it('rejects negative score', async () => {
        mockDb.attemptAnswer.findUnique.mockResolvedValue({
            questionId: 'q1',
            question: { points: 10 },
            attemptId: 'att-1',
        })

        const result = await gradeEssay('ans-1', -1, '')

        expect(result.success).toBe(false)
    })

    it('returns error for nonexistent answer', async () => {
        mockDb.attemptAnswer.findUnique.mockResolvedValue(null)

        const result = await gradeEssay('fake', 5, '')

        expect(result.success).toBe(false)
        expect(result.error).toContain('tidak ditemukan')
    })
})
