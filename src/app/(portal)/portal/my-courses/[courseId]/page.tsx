import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CoursePlayer } from '@/components/portal/courses/course-player'

const levelLabels: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CoursePlayerPage({ params }: PageProps) {
  const { courseId } = await params
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })

  if (!enrollment) redirect('/portal/courses')

  const course = await db.course.findUnique({
    where: { id: courseId, status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      creator: { select: { name: true } },
      modules: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              type: true,
              content: true,
              videoUrl: true,
              fileUrl: true,
              duration: true,
              order: true,
            },
          },
        },
      },
    },
  })

  if (!course) notFound()

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/portal/my-courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>oleh {course.creator.name}</span>
            <span>·</span>
            <Badge variant="secondary" className="text-xs">
              {levelLabels[course.level] ?? course.level}
            </Badge>
            <span>·</span>
            <span>{totalLessons} pelajaran</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-primary">
            {enrollment.progress}%
          </p>
          <p className="text-xs text-muted-foreground">selesai</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${enrollment.progress}%` }}
        />
      </div>

      {/* Player */}
      <CoursePlayer
        modules={course.modules}
        courseTitle={course.title}
        progress={enrollment.progress}
      />
    </div>
  )
}
