'use client'

import { useOptimistic, useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import { toggleUserStatus } from '@/lib/actions/users'
import { toast } from 'sonner'

interface ToggleStatusButtonProps {
  userId: string
  isActive: boolean
  disabled?: boolean
}

export function ToggleStatusButton({
  userId,
  isActive,
  disabled,
}: ToggleStatusButtonProps) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(isActive)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    if (disabled) return
    startTransition(async () => {
      setOptimisticActive(!optimisticActive)
      const result = await toggleUserStatus(userId, !optimisticActive)
      if (!result.success) {
        toast.error(result.error)
      }
    })
  }

  return (
    <Switch
      checked={optimisticActive}
      onCheckedChange={handleToggle}
      disabled={disabled || isPending}
      aria-label={optimisticActive ? 'Nonaktifkan pengguna' : 'Aktifkan pengguna'}
    />
  )
}
