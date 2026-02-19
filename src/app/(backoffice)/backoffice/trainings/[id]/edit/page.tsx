import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getTrainingById } from '@/lib/actions/trainings'
import { TrainingForm } from '@/components/backoffice/trainings/training-form'

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR']

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditTrainingPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  if (!WRITE_ROLES.includes(session?.user?.role as string)) {
    redirect('/backoffice/trainings')
  }

  const training = await getTrainingById(id)
  if (!training) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Pelatihan</h1>
        <p className="mt-1 text-sm text-muted-foreground">{training.title}</p>
      </div>
      <TrainingForm training={training} />
    </div>
  )
}
