'use client'

import { useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Pencil,
  Layers,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
} from 'lucide-react'
import { DeleteCourseDialog } from './delete-course-dialog'
import type { CourseListItem, CourseStatus, CourseLevel } from '@/types/courses'

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

const LEVEL_BADGE_VARIANT: Record<CourseLevel, 'default' | 'secondary' | 'outline'> = {
  BEGINNER: 'outline',
  INTERMEDIATE: 'secondary',
  ADVANCED: 'default',
}

interface CourseTableProps {
  courses: CourseListItem[]
  total: number
  totalPages: number
  currentPage: number
  canEdit: boolean
}

export function CourseTable({
  courses,
  total,
  totalPages,
  currentPage,
  canEdit,
}: CourseTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function updateParam(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== 'ALL') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    if (!('page' in updates)) params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = useCallback(
    (value: string) => {
      if (searchRef.current) clearTimeout(searchRef.current)
      searchRef.current = setTimeout(() => {
        updateParam({ search: value || null })
      }, 400)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, pathname]
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari judul kursus..."
            defaultValue={searchParams.get('search') ?? ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          defaultValue={searchParams.get('status') ?? 'ALL'}
          onValueChange={(v) => updateParam({ status: v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draf</SelectItem>
            <SelectItem value="PUBLISHED">Diterbitkan</SelectItem>
            <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams.get('level') ?? 'ALL'}
          onValueChange={(v) => updateParam({ level: v })}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Level</SelectItem>
            <SelectItem value="BEGINNER">Pemula</SelectItem>
            <SelectItem value="INTERMEDIATE">Menengah</SelectItem>
            <SelectItem value="ADVANCED">Mahir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kursus</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat oleh</TableHead>
              <TableHead className="text-center">Modul</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Tidak ada kursus ditemukan
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-muted">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={LEVEL_BADGE_VARIANT[course.level]}>
                      {LEVEL_LABELS[course.level]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANT[course.status]}>
                      {STATUS_LABELS[course.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {course.creator.name}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {course._count.modules}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Open Builder */}
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label={`Buka builder ${course.title}`}
                      >
                        <Link href={`/backoffice/courses/${course.id}`}>
                          <Layers className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Edit metadata */}
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          aria-label={`Edit ${course.title}`}
                        >
                          <Link href={`/backoffice/courses/${course.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {/* Delete */}
                      {canEdit && (
                        <DeleteCourseDialog
                          courseId={course.id}
                          courseTitle={course.title}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total {total} kursus</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateParam({ page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{currentPage} / {totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateParam({ page: String(currentPage + 1) })}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
