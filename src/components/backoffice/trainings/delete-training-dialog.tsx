'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import { deleteTraining } from '@/lib/actions/trainings'
import { toast } from 'sonner'

interface DeleteTrainingDialogProps {
  trainingId: string
  trainingTitle: string
  redirectAfter?: boolean
}

export function DeleteTrainingDialog({
  trainingId,
  trainingTitle,
  redirectAfter = false,
}: DeleteTrainingDialogProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTraining(trainingId)
      if (result.success) {
        toast.success('Pelatihan dihapus')
        if (redirectAfter) router.push('/backoffice/trainings')
      } else {
        toast.error(result.error ?? 'Gagal menghapus pelatihan')
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pelatihan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus pelatihan{' '}
            <span className="font-medium">"{trainingTitle}"</span>? Semua
            pendaftaran peserta akan ikut terhapus. Tindakan ini tidak dapat
            dibatalkan.
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
