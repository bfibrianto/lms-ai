import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { CourseForm } from '@/components/backoffice/courses/course-form'

export default async function NewCoursePage() {
  const session = await auth()
  if (!['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'].includes(session!.user.role)) {
    redirect('/backoffice/courses')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/backoffice/courses">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tambah Kursus</h1>
          <p className="mt-1 text-muted-foreground">
            Buat kursus baru untuk pembelajaran
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CourseForm mode="create" />
      </div>
    </div>
  )
}
