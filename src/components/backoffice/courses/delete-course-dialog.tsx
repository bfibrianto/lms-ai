'use client'

import { useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteCourse } from '@/lib/actions/courses'
import { toast } from 'sonner'

interface DeleteCourseDialogProps {
  courseId: string
  courseTitle: string
}

export function DeleteCourseDialog({ courseId, courseTitle }: DeleteCourseDialogProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteCourse(courseId)
        if (result.success) {
          toast.success(`Kursus "${courseTitle}" berhasil dihapus`)
        } else {
          toast.error(result.error)
        }
      } catch {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          aria-label={`Hapus ${courseTitle}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kursus</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kursus{' '}
            <span className="font-semibold">{courseTitle}</span>? Semua modul
            dan pelajaran di dalamnya akan ikut terhapus. Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
