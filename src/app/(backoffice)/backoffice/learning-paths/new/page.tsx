import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LearningPathForm } from '@/components/backoffice/learning-paths/learning-path-form'

export default function NewLearningPathPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/backoffice/learning-paths"
                    className="rounded-full p-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Buat Learning Path</h1>
                    <p className="text-muted-foreground">Tambah jalur pembelajaran baru</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                </CardHeader>
                <CardContent>
                    <LearningPathForm />
                </CardContent>
            </Card>
        </div>
    )
}
