import { describe, it, expect } from 'vitest'
import {
    CreateCourseSchema,
    EditCourseSchema,
    EditLessonSchema,
} from '@/lib/validations/courses'

describe('CreateCourseSchema', () => {
    const validCourse = {
        title: 'Introduction to TypeScript',
        level: 'BEGINNER' as const,
    }

    it('accepts valid data with minimal fields', () => {
        const result = CreateCourseSchema.safeParse(validCourse)
        expect(result.success).toBe(true)
    })

    it('accepts valid data with all fields', () => {
        const result = CreateCourseSchema.safeParse({
            ...validCourse,
            description: 'A great course',
            thumbnail: 'https://example.com/thumb.jpg',
        })
        expect(result.success).toBe(true)
    })

    it('rejects title shorter than 3 chars', () => {
        const result = CreateCourseSchema.safeParse({ ...validCourse, title: 'AB' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('3 karakter')
        }
    })

    it('rejects title longer than 200 chars', () => {
        const result = CreateCourseSchema.safeParse({ ...validCourse, title: 'x'.repeat(201) })
        expect(result.success).toBe(false)
    })

    it('accepts all valid levels', () => {
        const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
        for (const level of levels) {
            const result = CreateCourseSchema.safeParse({ ...validCourse, level })
            expect(result.success).toBe(true)
        }
    })

    it('rejects invalid level', () => {
        const result = CreateCourseSchema.safeParse({ ...validCourse, level: 'EXPERT' })
        expect(result.success).toBe(false)
    })

    it('accepts empty string for optional description', () => {
        const result = CreateCourseSchema.safeParse({ ...validCourse, description: '' })
        expect(result.success).toBe(true)
    })

    it('rejects description longer than 5000 chars', () => {
        const result = CreateCourseSchema.safeParse({
            ...validCourse,
            description: 'x'.repeat(5001),
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid thumbnail URL', () => {
        const result = CreateCourseSchema.safeParse({
            ...validCourse,
            thumbnail: 'not-a-url',
        })
        expect(result.success).toBe(false)
    })

    it('accepts empty string for thumbnail', () => {
        const result = CreateCourseSchema.safeParse({ ...validCourse, thumbnail: '' })
        expect(result.success).toBe(true)
    })
})

describe('EditCourseSchema', () => {
    const validEdit = {
        title: 'Updated Course',
        level: 'INTERMEDIATE' as const,
        status: 'PUBLISHED' as const,
    }

    it('accepts valid edit data', () => {
        const result = EditCourseSchema.safeParse(validEdit)
        expect(result.success).toBe(true)
    })

    it('accepts all valid statuses', () => {
        const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const
        for (const status of statuses) {
            const result = EditCourseSchema.safeParse({ ...validEdit, status })
            expect(result.success).toBe(true)
        }
    })

    it('rejects invalid status', () => {
        const result = EditCourseSchema.safeParse({ ...validEdit, status: 'DELETED' })
        expect(result.success).toBe(false)
    })

    it('requires status field (unlike create)', () => {
        const { status, ...noStatus } = validEdit
        const result = EditCourseSchema.safeParse(noStatus)
        expect(result.success).toBe(false)
    })
})

describe('EditLessonSchema', () => {
    const validLesson = {
        title: 'Getting Started',
        type: 'TEXT' as const,
    }

    it('accepts valid TEXT lesson', () => {
        const result = EditLessonSchema.safeParse(validLesson)
        expect(result.success).toBe(true)
    })

    it('accepts valid VIDEO lesson', () => {
        const result = EditLessonSchema.safeParse({
            ...validLesson,
            type: 'VIDEO',
            videoUrl: 'https://youtube.com/watch?v=test123',
            duration: 30,
        })
        expect(result.success).toBe(true)
    })

    it('accepts valid DOCUMENT lesson', () => {
        const result = EditLessonSchema.safeParse({
            ...validLesson,
            type: 'DOCUMENT',
            fileUrl: 'https://example.com/doc.pdf',
        })
        expect(result.success).toBe(true)
    })

    it('rejects title shorter than 2 chars', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, title: 'X' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('2 karakter')
        }
    })

    it('rejects invalid lesson type', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, type: 'AUDIO' })
        expect(result.success).toBe(false)
    })

    it('accepts all valid lesson types', () => {
        const types = ['VIDEO', 'DOCUMENT', 'TEXT'] as const
        for (const type of types) {
            const result = EditLessonSchema.safeParse({ ...validLesson, type })
            expect(result.success).toBe(true)
        }
    })

    it('preprocesses empty duration to undefined', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, duration: '' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.duration).toBeUndefined()
        }
    })

    it('preprocesses null duration to undefined', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, duration: null })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.duration).toBeUndefined()
        }
    })

    it('rejects negative duration', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, duration: -1 })
        expect(result.success).toBe(false)
    })

    it('rejects non-integer duration', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, duration: 1.5 })
        expect(result.success).toBe(false)
    })

    it('rejects duration over 9999', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, duration: 10000 })
        expect(result.success).toBe(false)
    })

    it('rejects invalid videoUrl', () => {
        const result = EditLessonSchema.safeParse({ ...validLesson, videoUrl: 'not-a-url' })
        expect(result.success).toBe(false)
    })

    it('accepts content up to 50000 chars', () => {
        const result = EditLessonSchema.safeParse({
            ...validLesson,
            content: 'x'.repeat(50000),
        })
        expect(result.success).toBe(true)
    })

    it('rejects content over 50000 chars', () => {
        const result = EditLessonSchema.safeParse({
            ...validLesson,
            content: 'x'.repeat(50001),
        })
        expect(result.success).toBe(false)
    })
})
