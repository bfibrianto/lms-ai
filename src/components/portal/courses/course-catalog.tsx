'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookOpen, Search, Users, Layers } from 'lucide-react'
import { EnrollButton } from './enroll-button'
import type { EnrollmentCourse } from '@/types/enrollments'

const levelLabels: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

const levelVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  BEGINNER: 'secondary',
  INTERMEDIATE: 'default',
  ADVANCED: 'outline',
}

interface CourseCatalogProps {
  courses: EnrollmentCourse[]
  enrolledIds: string[]
  totalPages: number
  currentPage: number
  total: number
}

export function CourseCatalog({
  courses,
  enrolledIds,
  totalPages,
  currentPage,
  total,
}: CourseCatalogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      if (key !== 'page') params.delete('page')
      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchParams.get('search') ?? ''}
            placeholder="Cari kursus..."
            className="pl-9"
            onChange={(e) => {
              const val = e.target.value
              clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>)._searchTimer)
              ;(window as unknown as Record<string, ReturnType<typeof setTimeout>>)._searchTimer = setTimeout(
                () => updateParam('search', val),
                400
              )
            }}
          />
        </div>
        <Select
          defaultValue={searchParams.get('level') ?? 'all'}
          onValueChange={(v) => updateParam('level', v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Semua Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            <SelectItem value="BEGINNER">Pemula</SelectItem>
            <SelectItem value="INTERMEDIATE">Menengah</SelectItem>
            <SelectItem value="ADVANCED">Mahir</SelectItem>
          </SelectContent>
        </Select>
        <p className="shrink-0 text-sm text-muted-foreground">
          {total} kursus
        </p>
      </div>

      {/* Grid */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-medium">Tidak ada kursus</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Belum ada kursus yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id)
            return (
              <Card
                key={course.id}
                className="group flex flex-col overflow-hidden py-0 transition-shadow hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
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
                </div>

                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base leading-snug">
                      {course.title}
                    </CardTitle>
                    <Badge
                      variant={levelVariant[course.level] ?? 'secondary'}
                      className="shrink-0 text-xs"
                    >
                      {levelLabels[course.level] ?? course.level}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {course.description ?? 'Tidak ada deskripsi'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {course._count.modules} modul
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course._count.enrollments} peserta
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    oleh {course.creator.name}
                  </p>
                </CardContent>

                <CardFooter className="gap-2 border-t pt-3 pb-4">
                  {isEnrolled ? (
                    <>
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/portal/my-courses/${course.id}`}>
                          Lanjutkan Belajar
                        </Link>
                      </Button>
                      <EnrollButton
                        courseId={course.id}
                        isEnrolled={true}
                        className="shrink-0"
                      />
                    </>
                  ) : (
                    <EnrollButton
                      courseId={course.id}
                      isEnrolled={false}
                      className="w-full"
                    />
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => updateParam('page', String(currentPage - 1))}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => updateParam('page', String(currentPage + 1))}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  )
}
