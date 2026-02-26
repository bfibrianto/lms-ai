import { describe, it, expect } from 'vitest'
import {
    CreateQuizSchema,
    QuestionSchema,
    QuestionOptionSchema,
} from '@/lib/validations/quizzes'

// ─── QuestionOptionSchema ──────────────────────────────────────

describe('QuestionOptionSchema', () => {
    it('accepts valid option', () => {
        const result = QuestionOptionSchema.safeParse({ text: 'Jawaban A', isCorrect: true })
        expect(result.success).toBe(true)
    })

    it('defaults isCorrect to false', () => {
        const result = QuestionOptionSchema.safeParse({ text: 'Jawaban B' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.isCorrect).toBe(false)
        }
    })

    it('rejects empty text', () => {
        const result = QuestionOptionSchema.safeParse({ text: '' })
        expect(result.success).toBe(false)
    })

    it('rejects text exceeding 1000 chars', () => {
        const result = QuestionOptionSchema.safeParse({ text: 'x'.repeat(1001) })
        expect(result.success).toBe(false)
    })
})

// ─── QuestionSchema ────────────────────────────────────────────

describe('QuestionSchema', () => {
    it('accepts valid MCQ question', () => {
        const result = QuestionSchema.safeParse({
            type: 'MULTIPLE_CHOICE',
            text: 'Apa itu TypeScript?',
            points: 5,
            options: [
                { text: 'Bahasa pemrograman', isCorrect: true },
                { text: 'Database', isCorrect: false },
            ],
        })
        expect(result.success).toBe(true)
    })

    it('accepts valid essay question', () => {
        const result = QuestionSchema.safeParse({
            type: 'ESSAY',
            text: 'Jelaskan konsep OOP!',
            points: 10,
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid question type', () => {
        const result = QuestionSchema.safeParse({
            type: 'TRUE_FALSE',
            text: 'Valid?',
        })
        expect(result.success).toBe(false)
    })

    it('rejects text shorter than 3 chars', () => {
        const result = QuestionSchema.safeParse({
            type: 'ESSAY',
            text: 'AB',
        })
        expect(result.success).toBe(false)
    })

    it('defaults points to 1', () => {
        const result = QuestionSchema.safeParse({
            type: 'ESSAY',
            text: 'Jelaskan!',
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.points).toBe(1)
        }
    })

    it('coerces string points to number', () => {
        const result = QuestionSchema.safeParse({
            type: 'ESSAY',
            text: 'Soal ini',
            points: '5',
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.points).toBe(5)
        }
    })

    it('rejects points > 100', () => {
        const result = QuestionSchema.safeParse({
            type: 'ESSAY',
            text: 'Soal ini',
            points: 101,
        })
        expect(result.success).toBe(false)
    })

    it('rejects points < 1', () => {
        const result = QuestionSchema.safeParse({
            type: 'ESSAY',
            text: 'Soal ini',
            points: 0,
        })
        expect(result.success).toBe(false)
    })

    it('options are optional', () => {
        const result = QuestionSchema.safeParse({
            type: 'MULTIPLE_CHOICE',
            text: 'Pilih salah satu',
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.options).toBeUndefined()
        }
    })
})

// ─── CreateQuizSchema ──────────────────────────────────────────

describe('CreateQuizSchema', () => {
    const validQuiz = {
        title: 'Quiz Modul 1',
        passingScore: 70,
        maxAttempts: 3,
    }

    it('accepts valid quiz', () => {
        const result = CreateQuizSchema.safeParse(validQuiz)
        expect(result.success).toBe(true)
    })

    it('rejects title shorter than 3 chars', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, title: 'AB' })
        expect(result.success).toBe(false)
    })

    it('rejects title longer than 200 chars', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, title: 'A'.repeat(201) })
        expect(result.success).toBe(false)
    })

    it('defaults passingScore to 70', () => {
        const result = CreateQuizSchema.safeParse({ title: 'Test Quiz' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.passingScore).toBe(70)
        }
    })

    it('rejects passingScore > 100', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, passingScore: 101 })
        expect(result.success).toBe(false)
    })

    it('accepts passingScore = 0', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, passingScore: 0 })
        expect(result.success).toBe(true)
    })

    // Duration preprocessing
    it('converts empty string duration to undefined', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, duration: '' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.duration).toBeUndefined()
        }
    })

    it('converts null duration to undefined', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, duration: null })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.duration).toBeUndefined()
        }
    })

    it('accepts valid duration in minutes', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, duration: 30 })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.duration).toBe(30)
        }
    })

    it('rejects duration > 600', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, duration: 601 })
        expect(result.success).toBe(false)
    })

    it('rejects duration < 1', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, duration: 0 })
        expect(result.success).toBe(false)
    })

    // maxAttempts
    it('defaults maxAttempts to 1', () => {
        const result = CreateQuizSchema.safeParse({ title: 'Test' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.maxAttempts).toBe(1)
        }
    })

    it('rejects maxAttempts > 10', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, maxAttempts: 11 })
        expect(result.success).toBe(false)
    })

    // Boolean preprocessing (FormData sends strings)
    it('converts "true" string to true for shuffleQuestions', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, shuffleQuestions: 'true' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.shuffleQuestions).toBe(true)
        }
    })

    it('converts "false" string to false for shuffleQuestions', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, shuffleQuestions: 'false' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.shuffleQuestions).toBe(false)
        }
    })

    it('defaults showResult to true', () => {
        const result = CreateQuizSchema.safeParse(validQuiz)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.showResult).toBe(true)
        }
    })

    it('description can be empty string', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, description: '' })
        expect(result.success).toBe(true)
    })

    it('rejects description > 5000 chars', () => {
        const result = CreateQuizSchema.safeParse({ ...validQuiz, description: 'A'.repeat(5001) })
        expect(result.success).toBe(false)
    })
})
