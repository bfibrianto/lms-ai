'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Pencil,
  MapPin,
  Monitor,
  Users,
  CalendarDays,
} from 'lucide-react'
import { DeleteTrainingDialog } from './delete-training-dialog'
import {
  trainingTypeLabels,
  trainingStatusLabels,
} from '@/lib/validations/trainings'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import type { TrainingListItem } from '@/types/trainings'

const typeVariant: Record<
  string,
  'default' | 'secondary' | 'outline'
> = {
  WORKSHOP: 'default',
  SEMINAR: 'secondary',
  BOOTCAMP: 'outline',
}

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  DRAFT: 'secondary',
  OPEN: 'default',
  CLOSED: 'outline',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
}

interface TrainingTableProps {
  trainings: TrainingListItem[]
  total: number
  totalPages: number
  currentPage: number
  canEdit: boolean
}

export function TrainingTable({
  trainings,
  total,
  totalPages,
  currentPage,
  canEdit,
}: TrainingTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      if (key !== 'page') params.delete('page')
      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchParams.get('search') ?? ''}
            placeholder="Cari pelatihan..."
            className="pl-9 text-sm"
            onChange={(e) => {
              const val = e.target.value
              clearTimeout(
                (window as unknown as Record<string, ReturnType<typeof setTimeout>>)._trainingSearchTimer
              )
              ;(window as unknown as Record<string, ReturnType<typeof setTimeout>>)._trainingSearchTimer =
                setTimeout(() => updateParam('search', val), 400)
            }}
          />
        </div>
        <Select
          defaultValue={searchParams.get('type') ?? 'all'}
          onValueChange={(v) => updateParam('type', v)}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="WORKSHOP">Workshop</SelectItem>
            <SelectItem value="SEMINAR">Seminar</SelectItem>
            <SelectItem value="BOOTCAMP">Bootcamp</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams.get('status') ?? 'all'}
          onValueChange={(v) => updateParam('status', v)}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draf</SelectItem>
            <SelectItem value="OPEN">Terbuka</SelectItem>
            <SelectItem value="CLOSED">Ditutup</SelectItem>
            <SelectItem value="COMPLETED">Selesai</SelectItem>
            <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
        {canEdit && (
          <Button asChild size="sm">
            <Link href="/backoffice/trainings/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Tambah
            </Link>
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pelatihan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead>Status</TableHead>
              {canEdit && <TableHead className="w-24">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canEdit ? 7 : 6}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  Tidak ada pelatihan ditemukan
                </TableCell>
              </TableRow>
            ) : (
              trainings.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/backoffice/trainings/${t.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {t.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        oleh {t.creator.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={typeVariant[t.type] ?? 'secondary'}
                      className="text-xs"
                    >
                      {trainingTypeLabels[t.type] ?? t.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {format(new Date(t.startDate), 'd MMM yyyy', {
                          locale: idLocale,
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      s.d.{' '}
                      {format(new Date(t.endDate), 'd MMM yyyy', {
                        locale: idLocale,
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {t.location ? (
                        <>
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="max-w-32 truncate">{t.location}</span>
                        </>
                      ) : t.onlineUrl ? (
                        <>
                          <Monitor className="h-3.5 w-3.5 shrink-0" />
                          <span>Online</span>
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {t._count.registrations}
                        {t.capacity ? `/${t.capacity}` : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (statusVariant[t.status] as 'default' | 'secondary' | 'outline' | 'destructive') ??
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {trainingStatusLabels[t.status] ?? t.status}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link href={`/backoffice/trainings/${t.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteTrainingDialog
                          trainingId={t.id}
                          trainingTitle={t.title}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} pelatihan</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => updateParam('page', String(currentPage - 1))}
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => updateParam('page', String(currentPage + 1))}
            >
              Berikutnya
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
