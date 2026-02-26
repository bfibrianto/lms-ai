import type { LearningPath, LearningPathStatus, PathCourse, Course, CourseLevel } from '@/generated/prisma/client'

// Data types returned by server actions

export interface LearningPathListItem {
    id: string
    title: string
    description: string | null
    thumbnail: string | null
    status: LearningPathStatus
    createdAt: Date
    _count: {
        courses: number
        enrollments: number
    }
}

export interface PathCourseDetail extends PathCourse {
    course: {
        id: string
        title: string
        thumbnail: string | null
        level: CourseLevel
        _count: {
            modules: number
        }
    }
}

export interface LearningPathDetail extends LearningPath {
    courses: PathCourseDetail[]
    _count: {
        enrollments: number
    }
}

export interface PortalPathCourseDetail extends PathCourseDetail {
    isLocked: boolean
    isCompleted: boolean
    enrollmentStatus?: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED'
    progress: number
}

export interface PortalLearningPathDetail extends LearningPath {
    courses: PortalPathCourseDetail[]
    enrollment: {
        id: string
        enrolledAt: Date
        completedAt: Date | null
    } | null
    creator: {
        id: string
        name: string
    }
}
