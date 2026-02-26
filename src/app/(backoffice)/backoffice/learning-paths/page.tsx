import Link from 'next/link'
import { Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getLearningPaths } from '@/lib/actions/learning-paths'
import { LearningPathTable } from '@/components/backoffice/learning-paths/learning-path-table'

export default async function LearningPathsPage() {
    const session = await auth()

    const canEdit = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'].includes(session!.user.role)

    const paths = await getLearningPaths()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Learning Paths</h1>
                    <p className="mt-1 text-muted-foreground">Kelola alur pembelajaran bertahap (Learning Path).</p>
                </div>
                {canEdit && (
                    <Button asChild>
                        <Link href="/backoffice/learning-paths/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Path
                        </Link>
                    </Button>
                )}
            </div>

            <LearningPathTable paths={paths} canEdit={canEdit} />
        </div>
    )
}
