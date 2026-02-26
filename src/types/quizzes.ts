export interface QuizListItem {
    id: string
    title: string
    description: string | null
    passingScore: number
    duration: number | null
    maxAttempts: number
    _count: { questions: number; attempts: number }
    createdAt: Date
}

export interface QuestionDetail {
    id: string
    quizId: string
    type: string
    text: string
    points: number
    order: number
    options: QuestionOptionDetail[]
}

export interface QuestionOptionDetail {
    id: string
    text: string
    isCorrect: boolean
    order: number
}

export interface QuizDetail {
    id: string
    courseId: string
    title: string
    description: string | null
    passingScore: number
    duration: number | null
    maxAttempts: number
    shuffleQuestions: boolean
    showResult: boolean
    questions: QuestionDetail[]
    _count: { attempts: number }
}

export interface QuizAttemptResult {
    id: string
    quizId: string
    score: number | null
    passed: boolean | null
    startedAt: Date
    submittedAt: Date | null
    quiz: {
        title: string
        passingScore: number
        showResult: boolean
    }
    answers: AttemptAnswerDetail[]
}

export interface AttemptAnswerDetail {
    id: string
    questionId: string
    optionId: string | null
    essayText: string | null
    score: number | null
    feedback: string | null
    question: {
        text: string
        type: string
        points: number
        options: { id: string; text: string; isCorrect: boolean }[]
    }
}

export interface EssayToGrade {
    id: string
    essayText: string | null
    score: number | null
    feedback: string | null
    question: {
        text: string
        points: number
    }
    attempt: {
        id: string
        enrollment: {
            user: { name: string; email: string }
        }
    }
}
