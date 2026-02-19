import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TrainingForm } from '@/components/backoffice/trainings/training-form'

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR']

export default async function NewTrainingPage() {
  const session = await auth()
  if (!WRITE_ROLES.includes(session?.user?.role as string)) {
    redirect('/backoffice/trainings')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buat Pelatihan Baru</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Isi detail pelatihan yang akan diselenggarakan.
        </p>
      </div>
      <TrainingForm />
    </div>
  )
}
