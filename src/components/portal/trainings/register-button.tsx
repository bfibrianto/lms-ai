'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  registerTraining,
  cancelTrainingRegistration,
} from '@/lib/actions/trainings'
import { toast } from 'sonner'
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react'

interface RegisterButtonProps {
  trainingId: string
  isRegistered: boolean
  isFull: boolean
  className?: string
}

export function RegisterButton({
  trainingId,
  isRegistered,
  isFull,
  className,
}: RegisterButtonProps) {
  const [registered, setRegistered] = useState(isRegistered)
  const [isPending, startTransition] = useTransition()

  function handleRegister() {
    startTransition(async () => {
      const result = await registerTraining(trainingId)
      if (result.success) {
        setRegistered(true)
        toast.success('Berhasil mendaftar pelatihan!')
      } else {
        toast.error(result.error ?? 'Gagal mendaftar')
      }
    })
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelTrainingRegistration(trainingId)
      if (result.success) {
        setRegistered(false)
        toast.success('Pendaftaran dibatalkan')
      } else {
        toast.error(result.error ?? 'Gagal membatalkan pendaftaran')
      }
    })
  }

  if (registered) {
    return (
      <Button
        variant="outline"
        onClick={handleCancel}
        disabled={isPending}
        className={className}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CalendarX className="mr-2 h-4 w-4" />
        )}
        {isPending ? 'Memproses...' : 'Batalkan Pendaftaran'}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={isPending || isFull}
      className={className}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CalendarCheck className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Mendaftarkan...' : isFull ? 'Kuota Penuh' : 'Daftar'}
    </Button>
  )
}
