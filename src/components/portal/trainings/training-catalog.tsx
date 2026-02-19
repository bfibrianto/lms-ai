'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
  CalendarDays,
  MapPin,
  Monitor,
  Users,
  Search,
  ClipboardList,
} from 'lucide-react'
import { RegisterButton } from './register-button'
import {
  trainingTypeLabels,
} from '@/lib/validations/trainings'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const typeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  WORKSHOP: 'default',
  SEMINAR: 'secondary',
  BOOTCAMP: 'outline',
}

interface Training {
  id: string
  title: string
  description: string | null
  type: string
  status: string
  startDate: Date
  endDate: Date
  location: string | null
  onlineUrl: string | null
  capacity: number | null
  creator: { name: string }
  _count: { registrations: number }
}

interface TrainingCatalogProps {
  trainings: Training[]
  registeredIds: string[]
  total: number
  totalPages: number
  currentPage: number
}

export function TrainingCatalog({
  trainings,
  registeredIds,
  total,
  totalPages,
  currentPage,
}: TrainingCatalogProps) {
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchParams.get('search') ?? ''}
            placeholder="Cari pelatihan..."
            className="pl-9"
            onChange={(e) => {
              const val = e.target.value
              clearTimeout(
                (window as unknown as Record<string, ReturnType<typeof setTimeout>>)._trainSearchTimer
              )
              ;(window as unknown as Record<string, ReturnType<typeof setTimeout>>)._trainSearchTimer =
                setTimeout(() => updateParam('search', val), 400)
            }}
          />
        </div>
        <Select
          defaultValue={searchParams.get('type') ?? 'all'}
          onValueChange={(v) => updateParam('type', v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="WORKSHOP">Workshop</SelectItem>
            <SelectItem value="SEMINAR">Seminar</SelectItem>
            <SelectItem value="BOOTCAMP">Bootcamp</SelectItem>
          </SelectContent>
        </Select>
        <p className="shrink-0 text-sm text-muted-foreground">{total} pelatihan</p>
      </div>

      {/* Grid */}
      {trainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-medium">Tidak ada pelatihan</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Belum ada pelatihan yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {trainings.map((training) => {
            const isRegistered = registeredIds.includes(training.id)
            const isFull =
              training.capacity !== null &&
              training._count.registrations >= training.capacity

            return (
              <Card
                key={training.id}
                className="flex flex-col overflow-hidden py-0 transition-shadow hover:shadow-md"
              >
                {/* Color band */}
                <div
                  className={`h-2 w-full ${
                    training.type === 'WORKSHOP'
                      ? 'bg-blue-500'
                      : training.type === 'SEMINAR'
                        ? 'bg-teal-500'
                        : 'bg-amber-500'
                  }`}
                />

                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base leading-snug">
                      {training.title}
                    </CardTitle>
                    <Badge
                      variant={typeVariant[training.type] ?? 'secondary'}
                      className="shrink-0 text-xs"
                    >
                      {trainingTypeLabels[training.type] ?? training.type}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {training.description ?? 'Tidak ada deskripsi'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-2 pb-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {format(new Date(training.startDate), 'd MMM yyyy', {
                        locale: idLocale,
                      })}
                      {' – '}
                      {format(new Date(training.endDate), 'd MMM yyyy', {
                        locale: idLocale,
                      })}
                    </span>
                  </div>

                  {/* Location */}
                  {training.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{training.location}</span>
                    </div>
                  )}
                  {!training.location && training.onlineUrl && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Monitor className="h-3.5 w-3.5 shrink-0" />
                      <span>Online</span>
                    </div>
                  )}

                  {/* Capacity */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {training._count.registrations} peserta terdaftar
                      {training.capacity ? ` (maks. ${training.capacity})` : ''}
                    </span>
                    {isFull && (
                      <Badge variant="destructive" className="text-xs">
                        Penuh
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    oleh {training.creator.name}
                  </p>
                </CardContent>

                <CardFooter className="border-t pt-3 pb-4">
                  <RegisterButton
                    trainingId={training.id}
                    isRegistered={isRegistered}
                    isFull={isFull && !isRegistered}
                    className="w-full"
                  />
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => updateParam('page', String(currentPage - 1))}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
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
  )
}
