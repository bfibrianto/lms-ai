'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { enrollCourse, unenrollCourse } from '@/lib/actions/enrollments'
import { toast } from 'sonner'
import { BookOpen, Loader2, LogOut, PlayCircle } from 'lucide-react'

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
  className?: string
}

export function EnrollButton({ courseId, isEnrolled, className }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleEnroll() {
    startTransition(async () => {
      const result = await enrollCourse(courseId)
      if (result.success) {
        toast.success('Berhasil mendaftar! Mengarahkan ke kursus...')
        router.push(`/portal/my-courses/${courseId}`)
      } else {
        toast.error(result.error ?? 'Gagal mendaftar')
      }
    })
  }

  function handleUnenroll() {
    startTransition(async () => {
      const result = await unenrollCourse(courseId)
      if (result.success) {
        setEnrolled(false)
        toast.success('Pendaftaran dibatalkan')
      } else {
        toast.error(result.error ?? 'Gagal membatalkan pendaftaran')
      }
    })
  }

  if (enrolled) {
    return (
      <div className={`flex gap-2 ${className ?? ''}`}>
        <Button asChild className="flex-1">
          <Link href={`/portal/my-courses/${courseId}`}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Mulai Belajar
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleUnenroll}
          disabled={isPending}
          title="Batalkan pendaftaran"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleEnroll} disabled={isPending} className={className}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BookOpen className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
    </Button>
  )
}
