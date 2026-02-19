import { auth } from '@/lib/auth'
import { getMyEnrollments } from '@/lib/actions/enrollments'
import { MyCoursesList } from '@/components/portal/courses/my-courses-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default async function MyCoursesPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const enrollments = await getMyEnrollments(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kursus Saya</h1>
          <p className="mt-1 text-muted-foreground">
            Pantau progres belajarmu di sini.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/portal/courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Jelajahi Kursus
          </Link>
        </Button>
      </div>

      <MyCoursesList enrollments={enrollments} />
    </div>
  )
}
