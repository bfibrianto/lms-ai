import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getTrainingById } from '@/lib/actions/trainings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CalendarDays,
  MapPin,
  Monitor,
  Users,
  Pencil,
  ArrowLeft,
  Link2,
} from 'lucide-react'
import { RegistrantsTable } from '@/components/backoffice/trainings/registrants-table'
import { DeleteTrainingDialog } from '@/components/backoffice/trainings/delete-training-dialog'
import {
  trainingTypeLabels,
  trainingStatusLabels,
} from '@/lib/validations/trainings'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR']

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

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TrainingDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const canEdit = WRITE_ROLES.includes(session?.user?.role as string)

  const training = await getTrainingById(id)
  if (!training) notFound()

  const isFull =
    training.capacity !== null &&
    training._count.registrations >= training.capacity

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/backoffice/trainings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{training.title}</h1>
            <Badge variant="secondary" className="text-xs">
              {trainingTypeLabels[training.type] ?? training.type}
            </Badge>
            <Badge
              variant={statusVariant[training.status] ?? 'secondary'}
              className="text-xs"
            >
              {trainingStatusLabels[training.status] ?? training.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            oleh {training.creator.name}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/backoffice/trainings/${id}/edit`}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteTrainingDialog
              trainingId={id}
              trainingTitle={training.title}
              redirectAfter
            />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Mulai</p>
              <p className="text-sm font-medium">
                {format(new Date(training.startDate), 'd MMM yyyy, HH:mm', {
                  locale: idLocale,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Selesai</p>
              <p className="text-sm font-medium">
                {format(new Date(training.endDate), 'd MMM yyyy, HH:mm', {
                  locale: idLocale,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Peserta</p>
              <p className="text-sm font-medium">
                {training._count.registrations}
                {training.capacity ? ` / ${training.capacity}` : ' peserta'}
                {isFull && (
                  <span className="ml-1 text-xs text-destructive">(penuh)</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            {training.location ? (
              <>
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="text-sm font-medium">{training.location}</p>
                </div>
              </>
            ) : training.onlineUrl ? (
              <>
                <Monitor className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Online</p>
                  <a
                    href={training.onlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Buka Link
                  </a>
                </div>
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="text-sm text-muted-foreground">Belum diset</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {training.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Deskripsi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {training.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Registrants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Daftar Peserta ({training._count.registrations})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <RegistrantsTable
            registrations={training.registrations}
            canEdit={canEdit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
