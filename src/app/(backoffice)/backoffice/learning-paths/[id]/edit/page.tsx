import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLearningPathDetail } from '@/lib/actions/learning-paths'
import { LearningPathForm } from '@/components/backoffice/learning-paths/learning-path-form'
import { LearningPathCourseList } from '@/components/backoffice/learning-paths/learning-path-course-list'

interface PageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ tab?: string }>
}

export default async function EditLearningPathPage({ params, searchParams }: PageProps) {
    const session = await auth()
    if (!['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'].includes(session!.user.role)) {
        redirect('/backoffice/learning-paths')
    }

    const { id } = await params
    const { tab } = await searchParams

    const path = await getLearningPathDetail(id)
    if (!path) notFound()

    // Fetch all published courses for the selector
    const allCourses = await db.course.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, title: true, level: true, thumbnail: true },
        orderBy: { title: 'asc' }
    })

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/backoffice/learning-paths"
                    className="rounded-full p-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Learning Path</h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola path <span className="font-medium text-foreground">{path.title}</span>
                    </p>
                </div>
            </div>

            <Tabs defaultValue={tab === 'courses' ? 'courses' : 'details'}>
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="details">Informasi Detail</TabsTrigger>
                    <TabsTrigger value="courses">Daftar Kursus</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="pt-6">
                    <LearningPathForm initialData={path} isEdit />
                </TabsContent>

                <TabsContent value="courses" className="pt-6">
                    <LearningPathCourseList
                        pathId={path.id}
                        initialCourses={path.courses}
                        allCourses={allCourses}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
