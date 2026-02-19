import { auth } from '@/lib/auth'
import { getPublishedCourses, getEnrolledCourseIds } from '@/lib/actions/enrollments'
import { CourseCatalog } from '@/components/portal/courses/course-catalog'

interface PageProps {
  searchParams: Promise<{ search?: string; level?: string; page?: string }>
}

export default async function PortalCoursesPage({ searchParams }: PageProps) {
  const { search, level, page } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const [{ courses, total, totalPages, page: currentPage }, enrolledIds] =
    await Promise.all([
      getPublishedCourses({
        search,
        level,
        page: page ? parseInt(page) : 1,
      }),
      getEnrolledCourseIds(userId),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Katalog Kursus</h1>
        <p className="mt-1 text-muted-foreground">
          Temukan kursus yang sesuai dengan kebutuhanmu.
        </p>
      </div>

      <CourseCatalog
        courses={courses}
        enrolledIds={enrolledIds}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  )
}
