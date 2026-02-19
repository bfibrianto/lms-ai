import { auth } from '@/lib/auth'
import { getTrainings } from '@/lib/actions/trainings'
import { TrainingTable } from '@/components/backoffice/trainings/training-table'

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR']

interface PageProps {
  searchParams: Promise<{
    search?: string
    type?: string
    status?: string
    page?: string
  }>
}

export default async function BackofficeTrainingsPage({
  searchParams,
}: PageProps) {
  const { search, type, status, page } = await searchParams
  const session = await auth()
  const canEdit = WRITE_ROLES.includes(session?.user?.role as string)

  const { trainings, total, totalPages, page: currentPage } = await getTrainings({
    search,
    type,
    status,
    page: page ? parseInt(page) : 1,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pelatihan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola jadwal pelatihan (workshop, seminar, bootcamp).
        </p>
      </div>

      <TrainingTable
        trainings={trainings}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        canEdit={canEdit}
      />
    </div>
  )
}
