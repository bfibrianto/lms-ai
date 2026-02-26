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
    course: {
        findUnique: vi.fn(),
    },
    enrollment: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
    },
    lessonCompletion: {
        upsert: vi.fn(),
        count: vi.fn(),
    },
    lesson: {
        count: vi.fn(),
    },
}

vi.mock('@/lib/db', () => ({
    db: mockDb,
}))

// Import after mocks
const {
    enrollCourse,
    unenrollCourse,
    getMyEnrollments,
    getEnrolledCourseIds,
    completeLesson,
    getCompletedLessonIds,
    updateLastAccessed,
} = await import('@/lib/actions/enrollments')

const USER = { id: 'user-1', role: 'EMPLOYEE' }

describe('enrollCourse', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('successfully enrolls into a published course', async () => {
        mockDb.course.findUnique.mockResolvedValue({ id: 'course-1' })
        mockDb.enrollment.findUnique.mockResolvedValue(null)
        mockDb.enrollment.create.mockResolvedValue({ id: 'enroll-1' })

        const result = await enrollCourse('course-1')

        expect(result.success).toBe(true)
        expect(mockDb.enrollment.create).toHaveBeenCalledWith({
            data: { userId: 'user-1', courseId: 'course-1' },
        })
    })

    it('returns error if course not found', async () => {
        mockDb.course.findUnique.mockResolvedValue(null)

        const result = await enrollCourse('nonexistent')

        expect(result.success).toBe(false)
        expect(result.error).toContain('tidak ditemukan')
    })

    it('returns error if already enrolled', async () => {
        mockDb.course.findUnique.mockResolvedValue({ id: 'course-1' })
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'existing' })

        const result = await enrollCourse('course-1')

        expect(result.success).toBe(false)
        expect(result.error).toContain('Sudah terdaftar')
    })

    it('returns error if not authenticated', async () => {
        mockAuth.mockResolvedValue(null)

        const result = await enrollCourse('course-1')

        expect(result.success).toBe(false)
    })
})

describe('unenrollCourse', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('successfully unenrolls from a course', async () => {
        mockDb.enrollment.delete.mockResolvedValue({ id: 'enroll-1' })

        const result = await unenrollCourse('course-1')

        expect(result.success).toBe(true)
        expect(mockDb.enrollment.delete).toHaveBeenCalledWith({
            where: { userId_courseId: { userId: 'user-1', courseId: 'course-1' } },
        })
    })

    it('returns error if delete fails', async () => {
        mockDb.enrollment.delete.mockRejectedValue(new Error('Not found'))

        const result = await unenrollCourse('nonexistent')

        expect(result.success).toBe(false)
    })
})

describe('getMyEnrollments', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns enrollments for a user', async () => {
        const mockEnrollments = [
            {
                id: 'e1',
                status: 'IN_PROGRESS',
                progress: 50,
                lastLessonId: 'lesson-1',
                enrolledAt: new Date(),
                completedAt: null,
                course: {
                    id: 'c1',
                    title: 'Test Course',
                    description: null,
                    thumbnail: null,
                    level: 'BEGINNER',
                    creator: { name: 'Mentor' },
                    _count: { modules: 3 },
                },
            },
        ]
        mockDb.enrollment.findMany.mockResolvedValue(mockEnrollments)

        const result = await getMyEnrollments('user-1')

        expect(result).toEqual(mockEnrollments)
        expect(mockDb.enrollment.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId: 'user-1' },
            })
        )
    })

    it('returns empty array for user with no enrollments', async () => {
        mockDb.enrollment.findMany.mockResolvedValue([])

        const result = await getMyEnrollments('user-no-courses')

        expect(result).toEqual([])
    })
})

describe('getEnrolledCourseIds', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns array of enrolled courseIds', async () => {
        mockDb.enrollment.findMany.mockResolvedValue([
            { courseId: 'c1' },
            { courseId: 'c2' },
        ])

        const result = await getEnrolledCourseIds('user-1')

        expect(result).toEqual(['c1', 'c2'])
    })
})

describe('completeLesson', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('marks a lesson as complete and updates progress', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.lessonCompletion.upsert.mockResolvedValue({})
        mockDb.lesson.count.mockResolvedValue(10)
        mockDb.lessonCompletion.count.mockResolvedValue(5)
        mockDb.enrollment.update.mockResolvedValue({})

        const result = await completeLesson('course-1', 'lesson-5')

        expect(result.success).toBe(true)
        expect(result.progress).toBe(50)
        expect(mockDb.enrollment.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    progress: 50,
                    status: 'IN_PROGRESS',
                    lastLessonId: 'lesson-5',
                }),
            })
        )
    })

    it('sets enrollment to COMPLETED when all lessons done', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.lessonCompletion.upsert.mockResolvedValue({})
        mockDb.lesson.count.mockResolvedValue(5)
        mockDb.lessonCompletion.count.mockResolvedValue(5)
        mockDb.enrollment.update.mockResolvedValue({})

        const result = await completeLesson('course-1', 'lesson-5')

        expect(result.success).toBe(true)
        expect(result.progress).toBe(100)
        expect(mockDb.enrollment.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    progress: 100,
                    status: 'COMPLETED',
                    completedAt: expect.any(Date),
                }),
            })
        )
    })

    it('handles 0 total lessons gracefully', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.lessonCompletion.upsert.mockResolvedValue({})
        mockDb.lesson.count.mockResolvedValue(0)
        mockDb.lessonCompletion.count.mockResolvedValue(0)
        mockDb.enrollment.update.mockResolvedValue({})

        const result = await completeLesson('course-1', 'lesson-1')

        expect(result.success).toBe(true)
        expect(result.progress).toBe(0)
    })

    it('returns error if not enrolled', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue(null)

        const result = await completeLesson('course-1', 'lesson-1')

        expect(result.success).toBe(false)
        expect(result.error).toContain('Belum terdaftar')
    })

    it('returns error if not authenticated', async () => {
        mockAuth.mockResolvedValue(null)

        const result = await completeLesson('course-1', 'lesson-1')

        expect(result.success).toBe(false)
    })

    it('uses upsert to be idempotent', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({ id: 'enroll-1' })
        mockDb.lessonCompletion.upsert.mockResolvedValue({})
        mockDb.lesson.count.mockResolvedValue(1)
        mockDb.lessonCompletion.count.mockResolvedValue(1)
        mockDb.enrollment.update.mockResolvedValue({})

        await completeLesson('course-1', 'lesson-1')

        expect(mockDb.lessonCompletion.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    enrollmentId_lessonId: {
                        enrollmentId: 'enroll-1',
                        lessonId: 'lesson-1',
                    },
                },
            })
        )
    })
})

describe('getCompletedLessonIds', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns array of completed lesson IDs', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({
            completions: [{ lessonId: 'l1' }, { lessonId: 'l2' }, { lessonId: 'l3' }],
        })

        const result = await getCompletedLessonIds('user-1', 'course-1')

        expect(result).toEqual(['l1', 'l2', 'l3'])
    })

    it('returns empty array if not enrolled', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue(null)

        const result = await getCompletedLessonIds('user-1', 'course-1')

        expect(result).toEqual([])
    })

    it('returns empty array if no completions', async () => {
        mockDb.enrollment.findUnique.mockResolvedValue({
            completions: [],
        })

        const result = await getCompletedLessonIds('user-1', 'course-1')

        expect(result).toEqual([])
    })
})

describe('updateLastAccessed', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAuth.mockResolvedValue({ user: USER })
    })

    it('updates lastLessonId and sets status to IN_PROGRESS', async () => {
        mockDb.enrollment.update.mockResolvedValue({})

        const result = await updateLastAccessed('course-1', 'lesson-3')

        expect(result.success).toBe(true)
        expect(mockDb.enrollment.update).toHaveBeenCalledWith({
            where: { userId_courseId: { userId: 'user-1', courseId: 'course-1' } },
            data: {
                lastLessonId: 'lesson-3',
                status: 'IN_PROGRESS',
            },
        })
    })

    it('returns false if update fails', async () => {
        mockDb.enrollment.update.mockRejectedValue(new Error('Not found'))

        const result = await updateLastAccessed('course-1', 'lesson-1')

        expect(result.success).toBe(false)
    })
})
