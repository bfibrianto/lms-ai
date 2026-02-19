'use client'

import { useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { updateRegistrationStatus } from '@/lib/actions/trainings'
import { registrationStatusLabels } from '@/lib/validations/trainings'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  REGISTERED: 'secondary',
  ATTENDED: 'default',
  ABSENT: 'outline',
  CANCELLED: 'destructive',
}

interface Registrant {
  id: string
  status: string
  registeredAt: Date
  user: { id: string; name: string; email: string; department: string | null }
}

interface RegistrantsTableProps {
  registrations: Registrant[]
  canEdit: boolean
}

export function RegistrantsTable({
  registrations,
  canEdit,
}: RegistrantsTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(regId: string, status: string) {
    startTransition(async () => {
      const result = await updateRegistrationStatus(
        regId,
        status as 'REGISTERED' | 'ATTENDED' | 'ABSENT' | 'CANCELLED'
      )
      if (result.success) {
        toast.success('Status diperbarui')
      } else {
        toast.error(result.error ?? 'Gagal memperbarui status')
      }
    })
  }

  if (registrations.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Belum ada peserta yang mendaftar
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead>Tanggal Daftar</TableHead>
            <TableHead>Status Kehadiran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg, idx) => (
            <TableRow key={reg.id}>
              <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
              <TableCell className="font-medium">{reg.user.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {reg.user.email}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {reg.user.department ?? '—'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {format(new Date(reg.registeredAt), 'd MMM yyyy HH:mm', {
                  locale: idLocale,
                })}
              </TableCell>
              <TableCell>
                {canEdit ? (
                  <Select
                    defaultValue={reg.status}
                    onValueChange={(v) => handleStatusChange(reg.id, v)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGISTERED">Terdaftar</SelectItem>
                      <SelectItem value="ATTENDED">Hadir</SelectItem>
                      <SelectItem value="ABSENT">Tidak Hadir</SelectItem>
                      <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={
                      statusVariant[reg.status] ?? 'secondary'
                    }
                    className="text-xs"
                  >
                    {registrationStatusLabels[reg.status] ?? reg.status}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
