import Link from 'next/link'
import { Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getCourses } from '@/lib/actions/courses'
import { CourseTable } from '@/components/backoffice/courses/course-table'

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    level?: string
    page?: string
  }>
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const session = await auth()
  const params = await searchParams
  const page = Number(params.page) || 1

  const canEdit = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'].includes(session!.user.role)

  const { courses, total, totalPages } = await getCourses({
    search: params.search,
    status: params.status,
    level: params.level,
    page,
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kursus</h1>
          <p className="mt-1 text-muted-foreground">Kelola kursus pembelajaran</p>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href="/backoffice/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kursus
            </Link>
          </Button>
        )}
      </div>

      <CourseTable
        courses={courses}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        canEdit={canEdit}
      />
    </div>
  )
}
