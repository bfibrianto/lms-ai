'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, Layers, PlayCircle } from 'lucide-react'
import type { MyCoursesItem } from '@/types/enrollments'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const levelLabels: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

const enrollmentStatusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  ENROLLED: { label: 'Terdaftar', variant: 'secondary' },
  IN_PROGRESS: { label: 'Berlangsung', variant: 'default' },
  COMPLETED: { label: 'Selesai', variant: 'outline' },
  DROPPED: { label: 'Dibatalkan', variant: 'outline' },
}

interface MyCoursesListProps {
  enrollments: MyCoursesItem[]
}

export function MyCoursesList({ enrollments }: MyCoursesListProps) {
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h3 className="text-base font-medium">Belum ada kursus</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Kamu belum mendaftar kursus apapun.
        </p>
        <Button asChild className="mt-4">
          <Link href="/portal/courses">Jelajahi Kursus</Link>
        </Button>
      </div>
    )
  }

  const completed = enrollments.filter((e) => e.status === 'COMPLETED').length
  const inProgress = enrollments.filter((e) => e.status === 'IN_PROGRESS').length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold">{enrollments.length}</p>
          <p className="text-sm text-muted-foreground">Total Kursus</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-primary">{inProgress}</p>
          <p className="text-sm text-muted-foreground">Sedang Belajar</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{completed}</p>
          <p className="text-sm text-muted-foreground">Selesai</p>
        </div>
      </div>

      {/* Course cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {enrollments.map((enrollment) => {
          const { course } = enrollment
          const sc = enrollmentStatusConfig[enrollment.status] ?? {
            label: enrollment.status,
            variant: 'secondary' as const,
          }

          return (
            <Card
              key={enrollment.id}
              className="group flex flex-col overflow-hidden py-0 transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-12 w-12 text-primary/30" />
                )}
                {enrollment.status === 'COMPLETED' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                )}
                {/* Progress bar */}
                {enrollment.progress > 0 && enrollment.status !== 'COMPLETED' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-base leading-snug">
                    {course.title}
                  </CardTitle>
                  <Badge variant={sc.variant} className="shrink-0 text-xs">
                    {sc.label}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {levelLabels[course.level] ?? course.level} · oleh{' '}
                  {course.creator.name}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {course._count.modules} modul
                  </span>
                  {enrollment.progress > 0 && (
                    <span className="font-medium text-primary">
                      {enrollment.progress}% selesai
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Didaftar{' '}
                  {formatDistanceToNow(new Date(enrollment.enrolledAt), {
                    addSuffix: true,
                    locale: idLocale,
                  })}
                </p>
              </CardContent>

              <CardFooter className="border-t pt-3 pb-4">
                <Button asChild className="w-full" size="sm">
                  <Link href={`/portal/my-courses/${course.id}`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {enrollment.status === 'COMPLETED'
                      ? 'Tinjau Kursus'
                      : 'Lanjutkan Belajar'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
