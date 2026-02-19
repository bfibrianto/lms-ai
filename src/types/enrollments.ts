export interface EnrollmentCourse {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  level: string
  status: string
  creator: { name: string }
  _count: { modules: number; enrollments: number }
}

export interface MyCoursesItem {
  id: string
  status: string
  progress: number
  enrolledAt: Date
  completedAt: Date | null
  course: {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    level: string
    creator: { name: string }
    _count: { modules: number }
  }
}
