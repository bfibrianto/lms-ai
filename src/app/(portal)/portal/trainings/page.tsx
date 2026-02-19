import { auth } from '@/lib/auth'
import { getOpenTrainings, getMyTrainingIds } from '@/lib/actions/trainings'
import { TrainingCatalog } from '@/components/portal/trainings/training-catalog'

interface PageProps {
  searchParams: Promise<{ search?: string; type?: string; page?: string }>
}

export default async function PortalTrainingsPage({ searchParams }: PageProps) {
  const { search, type, page } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const [{ trainings, total, totalPages, page: currentPage }, registeredIds] =
    await Promise.all([
      getOpenTrainings({ search, type, page: page ? parseInt(page) : 1 }),
      getMyTrainingIds(userId),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pelatihan</h1>
        <p className="mt-1 text-muted-foreground">
          Daftarkan dirimu ke pelatihan yang tersedia.
        </p>
      </div>

      <TrainingCatalog
        trainings={trainings}
        registeredIds={registeredIds}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  )
}
