import type { CourseStatus, CourseLevel, LessonType } from '@/generated/prisma/client'

export type { CourseStatus, CourseLevel, LessonType }

export type CourseListItem = {
  id: string
  title: string
  thumbnail: string | null
  level: CourseLevel
  status: CourseStatus
  createdAt: Date
  creator: { name: string }
  _count: { modules: number }
}

export type LessonDetail = {
  id: string
  moduleId: string
  title: string
  type: LessonType
  content: string | null
  videoUrl: string | null
  fileUrl: string | null
  duration: number | null
  order: number
}

export type ModuleWithLessons = {
  id: string
  courseId: string
  title: string
  order: number
  lessons: LessonDetail[]
}

export type CourseDetail = {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  level: CourseLevel
  status: CourseStatus
  creatorId: string
  creator: { name: string }
  modules: ModuleWithLessons[]
  createdAt: Date
  updatedAt: Date
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// ─── Unified Course Items (Module + Quiz) ─────────────────

export type QuizSummary = {
  id: string
  title: string
  description: string | null
  passingScore: number
  duration: number | null
  maxAttempts: number
  order: number
  _count: { questions: number }
}

export type CourseItemType = 'MODULE' | 'QUIZ'

export type CourseItem = {
  id: string
  type: CourseItemType
  title: string
  order: number
  moduleData?: ModuleWithLessons
  quizData?: QuizSummary
}
