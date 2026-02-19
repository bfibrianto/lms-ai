import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Pencil } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCourseById } from '@/lib/actions/courses'
import { CourseBuilder } from '@/components/backoffice/courses/course-builder'
import type { CourseStatus, CourseLevel } from '@/types/courses'

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_LABELS: Record<CourseStatus, string> = {
  DRAFT: 'Draf',
  PUBLISHED: 'Diterbitkan',
  ARCHIVED: 'Diarsipkan',
}

const LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

const STATUS_BADGE_VARIANT: Record<CourseStatus, 'default' | 'secondary' | 'outline'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  ARCHIVED: 'outline',
}

export default async function CourseBuilderPage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  const course = await getCourseById(id)
  if (!course) notFound()

  const canEdit = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'].includes(session!.user.role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
            <Link href="/backoffice/courses">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <Badge variant={STATUS_BADGE_VARIANT[course.status]}>
                {STATUS_LABELS[course.status]}
              </Badge>
              <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {course.modules.length} modul •{' '}
              {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} pelajaran •
              Dibuat oleh {course.creator.name}
            </p>
            {course.description && (
              <p className="text-sm text-muted-foreground">{course.description}</p>
            )}
          </div>
        </div>
        {canEdit && (
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <Link href={`/backoffice/courses/${id}/edit`}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit Info
            </Link>
          </Button>
        )}
      </div>

      {/* Builder */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Konten Kursus</h2>
        <CourseBuilder initialData={course} canEdit={canEdit} />
      </div>
    </div>
  )
}
