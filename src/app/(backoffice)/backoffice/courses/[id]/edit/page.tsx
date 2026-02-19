import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getCourseById } from '@/lib/actions/courses'
import { CourseForm } from '@/components/backoffice/courses/course-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: PageProps) {
  const session = await auth()
  if (!['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'].includes(session!.user.role)) {
    redirect('/backoffice/courses')
  }

  const { id } = await params
  const course = await getCourseById(id)
  if (!course) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/backoffice/courses/${id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Info Kursus</h1>
          <p className="mt-1 text-muted-foreground">
            Ubah informasi kursus{' '}
            <span className="font-medium">{course.title}</span>
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CourseForm mode="edit" course={course} />
      </div>
    </div>
  )
}
