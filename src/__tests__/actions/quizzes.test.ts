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
    quiz: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    question: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    questionOption: {
        deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
}

vi.mock('@/lib/db', () => ({
    db: mockDb,
}))

// Import after mocks
const {
    getQuizzesByCourse,
    getQuizDetail,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
} = await import('@/lib/actions/quizzes')

const ADMIN = { id: 'admin-1', role: 'HR_ADMIN' }
const EMPLOYEE = { id: 'emp-1', role: 'EMPLOYEE' }

function makeFormData(data: Record<string, string>): FormData {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.set(k, v))
    return fd
}

// ─── getQuizzesByCourse ─────────────────────────────────────

describe('getQuizzesByCourse', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns quizzes for a course', async () => {
        const mockQuizzes = [
            { id: 'q1', title: 'Quiz 1', _count: { questions: 5, attempts: 3 } },
        ]
        mockDb.quiz.findMany.mockResolvedValue(mockQuizzes)

        const result = await getQuizzesByCourse('course-1')

        expect(result).toEqual(mockQuizzes)
        expect(mockDb.quiz.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { courseId: 'course-1' } })
        )
    })

    it('returns empty array for course with no quizzes', async () => {
        mockDb.quiz.findMany.mockResolvedValue([])

        const result = await getQuizzesByCourse('empty')
        expect(result).toEqual([])
    })
})

// ─── getQuizDetail ──────────────────────────────────────────

describe('getQuizDetail', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns quiz with questions and options', async () => {
        const mockQuiz = {
            id: 'q1',
            questions: [{ id: 'qn1', options: [{ id: 'o1' }] }],
        }
        mockDb.quiz.findUnique.mockResolvedValue(mockQuiz)

        const result = await getQuizDetail('q1')

        expect(result).toEqual(mockQuiz)
    })

    it('returns null for nonexistent quiz', async () => {
        mockDb.quiz.findUnique.mockResolvedValue(null)

        const result = await getQuizDetail('nonexistent')
        expect(result).toBeNull()
    })
})

// ─── createQuiz ─────────────────────────────────────────────

describe('createQuiz', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('creates quiz with valid data', async () => {
        mockDb.quiz.create.mockResolvedValue({ id: 'new-quiz' })

        const fd = makeFormData({
            title: 'Quiz Baru',
            passingScore: '70',
            maxAttempts: '3',
            duration: '30',
            shuffleQuestions: 'false',
            showResult: 'true',
        })
        const result = await createQuiz('course-1', fd)

        expect(result.success).toBe(true)
        expect(result.data?.id).toBe('new-quiz')
        expect(mockDb.quiz.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    courseId: 'course-1',
                    title: 'Quiz Baru',
                    passingScore: 70,
                    duration: 30,
                    maxAttempts: 3,
                }),
            })
        )
    })

    it('creates quiz with empty duration (unlimited)', async () => {
        mockDb.quiz.create.mockResolvedValue({ id: 'q2' })

        const fd = makeFormData({
            title: 'Quiz No Timer',
            passingScore: '50',
            maxAttempts: '1',
            duration: '',
            shuffleQuestions: 'false',
            showResult: 'true',
        })
        const result = await createQuiz('course-1', fd)

        expect(result.success).toBe(true)
        expect(mockDb.quiz.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ duration: null }),
            })
        )
    })

    it('returns error for invalid data', async () => {
        const fd = makeFormData({ title: 'AB' }) // too short
        const result = await createQuiz('course-1', fd)
        expect(result.success).toBe(false)
    })

    it('rejects non-admin users', async () => {
        mockAuth.mockResolvedValue({ user: EMPLOYEE })

        const fd = makeFormData({ title: 'Quiz' })
        await expect(createQuiz('course-1', fd)).rejects.toThrow('Akses ditolak')
    })
})

// ─── updateQuiz ─────────────────────────────────────────────

describe('updateQuiz', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('updates quiz with valid data', async () => {
        mockDb.quiz.update.mockResolvedValue({ courseId: 'course-1' })

        const fd = makeFormData({
            title: 'Updated Quiz',
            passingScore: '80',
            maxAttempts: '2',
            duration: '60',
            shuffleQuestions: 'true',
            showResult: 'true',
        })
        const result = await updateQuiz('quiz-1', fd)

        expect(result.success).toBe(true)
        expect(mockDb.quiz.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    title: 'Updated Quiz',
                    passingScore: 80,
                    shuffleQuestions: true,
                }),
            })
        )
    })
})

// ─── deleteQuiz ─────────────────────────────────────────────

describe('deleteQuiz', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('deletes existing quiz', async () => {
        mockDb.quiz.findUnique.mockResolvedValue({ courseId: 'c1' })
        mockDb.quiz.delete.mockResolvedValue({})

        const result = await deleteQuiz('quiz-1')

        expect(result.success).toBe(true)
        expect(mockDb.quiz.delete).toHaveBeenCalledWith({ where: { id: 'quiz-1' } })
    })

    it('returns error for nonexistent quiz', async () => {
        mockDb.quiz.findUnique.mockResolvedValue(null)

        const result = await deleteQuiz('fake')
        expect(result.success).toBe(false)
        expect(result.error).toContain('tidak ditemukan')
    })
})

// ─── addQuestion ────────────────────────────────────────────

describe('addQuestion', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('adds MCQ question with options', async () => {
        mockDb.question.findFirst.mockResolvedValue({ order: 2 })
        mockDb.question.create.mockResolvedValue({})
        mockDb.quiz.findUnique.mockResolvedValue({ courseId: 'c1' })

        const result = await addQuestion('quiz-1', {
            type: 'MULTIPLE_CHOICE',
            text: 'Pilih yang benar',
            points: 5,
            options: [
                { text: 'A', isCorrect: true },
                { text: 'B', isCorrect: false },
            ],
        })

        expect(result.success).toBe(true)
        expect(mockDb.question.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    quizId: 'quiz-1',
                    type: 'MULTIPLE_CHOICE',
                    order: 3, // next order after 2
                    options: {
                        create: expect.arrayContaining([
                            expect.objectContaining({ text: 'A', isCorrect: true }),
                        ]),
                    },
                }),
            })
        )
    })

    it('adds essay question without options', async () => {
        mockDb.question.findFirst.mockResolvedValue(null) // first question
        mockDb.question.create.mockResolvedValue({})
        mockDb.quiz.findUnique.mockResolvedValue({ courseId: 'c1' })

        const result = await addQuestion('quiz-1', {
            type: 'ESSAY',
            text: 'Jelaskan konsep OOP',
            points: 10,
        })

        expect(result.success).toBe(true)
        expect(mockDb.question.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    type: 'ESSAY',
                    order: 0,
                }),
            })
        )
    })

    it('rejects invalid question data', async () => {
        const result = await addQuestion('quiz-1', {
            type: 'INVALID',
            text: 'AB',
            points: 0,
        })
        expect(result.success).toBe(false)
    })
})

// ─── updateQuestion ─────────────────────────────────────────

describe('updateQuestion', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('updates question and recreates options', async () => {
        mockDb.questionOption.deleteMany.mockResolvedValue({})
        mockDb.question.update.mockResolvedValue({})
        mockDb.question.findUnique.mockResolvedValue({
            quiz: { courseId: 'c1' },
        })

        const result = await updateQuestion('q1', {
            type: 'MULTIPLE_CHOICE',
            text: 'Updated question',
            points: 3,
            options: [
                { text: 'New A', isCorrect: false },
                { text: 'New B', isCorrect: true },
            ],
        })

        expect(result.success).toBe(true)
        // Old options deleted
        expect(mockDb.questionOption.deleteMany).toHaveBeenCalledWith({
            where: { questionId: 'q1' },
        })
    })
})

// ─── deleteQuestion ─────────────────────────────────────────

describe('deleteQuestion', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('deletes existing question', async () => {
        mockDb.question.findUnique.mockResolvedValue({
            quiz: { courseId: 'c1' },
        })
        mockDb.question.delete.mockResolvedValue({})

        const result = await deleteQuestion('q1')
        expect(result.success).toBe(true)
    })

    it('returns error for nonexistent question', async () => {
        mockDb.question.findUnique.mockResolvedValue(null)

        const result = await deleteQuestion('fake')
        expect(result.success).toBe(false)
    })
})

// ─── reorderQuestions ───────────────────────────────────────

describe('reorderQuestions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: ADMIN })
    })

    it('reorders questions using $transaction', async () => {
        mockDb.$transaction.mockResolvedValue([])
        mockDb.quiz.findUnique.mockResolvedValue({ courseId: 'c1' })

        const result = await reorderQuestions('quiz-1', ['q3', 'q1', 'q2'])

        expect(result.success).toBe(true)
        expect(mockDb.$transaction).toHaveBeenCalled()
    })
})
