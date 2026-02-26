import { describe, it, expect } from 'vitest'
import { CreateTrainingSchema, EditTrainingSchema } from '@/lib/validations/trainings'

describe('CreateTrainingSchema', () => {
    const validTraining = {
        title: 'TypeScript Workshop',
        type: 'WORKSHOP' as const,
        startDate: '2026-03-01T09:00:00',
        endDate: '2026-03-01T17:00:00',
    }

    it('accepts valid data with minimal fields', () => {
        const result = CreateTrainingSchema.safeParse(validTraining)
        expect(result.success).toBe(true)
    })

    it('accepts valid data with all fields', () => {
        const result = CreateTrainingSchema.safeParse({
            ...validTraining,
            description: 'A great workshop',
            location: 'Jakarta',
            onlineUrl: 'https://meet.google.com/abc-def',
            capacity: 50,
        })
        expect(result.success).toBe(true)
    })

    it('accepts all training types', () => {
        const types = ['WORKSHOP', 'SEMINAR', 'BOOTCAMP'] as const
        for (const type of types) {
            const result = CreateTrainingSchema.safeParse({ ...validTraining, type })
            expect(result.success).toBe(true)
        }
    })

    it('rejects invalid training type', () => {
        const result = CreateTrainingSchema.safeParse({ ...validTraining, type: 'WEBINAR' })
        expect(result.success).toBe(false)
    })

    it('rejects title shorter than 3 chars', () => {
        const result = CreateTrainingSchema.safeParse({ ...validTraining, title: 'AB' })
        expect(result.success).toBe(false)
    })

    it('rejects empty startDate', () => {
        const result = CreateTrainingSchema.safeParse({ ...validTraining, startDate: '' })
        expect(result.success).toBe(false)
    })

    it('rejects empty endDate', () => {
        const result = CreateTrainingSchema.safeParse({ ...validTraining, endDate: '' })
        expect(result.success).toBe(false)
    })

    it('rejects endDate before startDate', () => {
        const result = CreateTrainingSchema.safeParse({
            ...validTraining,
            startDate: '2026-03-02T09:00:00',
            endDate: '2026-03-01T09:00:00',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('setelah')
        }
    })

    it('accepts same startDate and endDate', () => {
        const result = CreateTrainingSchema.safeParse({
            ...validTraining,
            startDate: '2026-03-01T09:00:00',
            endDate: '2026-03-01T09:00:00',
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid onlineUrl', () => {
        const result = CreateTrainingSchema.safeParse({
            ...validTraining,
            onlineUrl: 'not-a-url',
        })
        expect(result.success).toBe(false)
    })

    it('accepts empty string for optional onlineUrl', () => {
        const result = CreateTrainingSchema.safeParse({
            ...validTraining,
            onlineUrl: '',
        })
        expect(result.success).toBe(true)
    })

    it('accepts empty string for capacity', () => {
        const result = CreateTrainingSchema.safeParse({
            ...validTraining,
            capacity: '',
        })
        expect(result.success).toBe(true)
    })
})

describe('EditTrainingSchema', () => {
    const validEdit = {
        title: 'Updated Workshop',
        type: 'SEMINAR' as const,
        startDate: '2026-03-01T09:00:00',
        endDate: '2026-03-01T17:00:00',
        status: 'OPEN' as const,
    }

    it('accepts valid edit data', () => {
        const result = EditTrainingSchema.safeParse(validEdit)
        expect(result.success).toBe(true)
    })

    it('accepts all valid statuses', () => {
        const statuses = ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'] as const
        for (const status of statuses) {
            const result = EditTrainingSchema.safeParse({ ...validEdit, status })
            expect(result.success).toBe(true)
        }
    })

    it('rejects invalid status', () => {
        const result = EditTrainingSchema.safeParse({ ...validEdit, status: 'DELETED' })
        expect(result.success).toBe(false)
    })

    it('requires status field', () => {
        const { status, ...noStatus } = validEdit
        const result = EditTrainingSchema.safeParse(noStatus)
        expect(result.success).toBe(false)
    })
})
