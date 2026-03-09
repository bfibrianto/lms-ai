import { Metadata } from 'next'
import { getMyAssignments } from '@/lib/actions/assignments'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, CalendarDays, ArrowRight, PlayCircle, BookOpen, Route } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export const metadata: Metadata = {
    title: 'Tugas Wajib Saya | HabitForge LMS',
}

export default async function MyAssignmentsPage() {
    const res = await getMyAssignments()

    const getTypeIcon = (type: string) => {
        if (type === 'COURSE') return <PlayCircle className="w-5 h-5 text-blue-500" />
        if (type === 'TRAINING') return <BookOpen className="w-5 h-5 text-violet-500" />
        if (type === 'LEARNING_PATH') return <Route className="w-5 h-5 text-emerald-500" />
        return <Target className="w-5 h-5" />
    }

    const getTypeLabel = (type: string) => {
        if (type === 'COURSE') return 'Kursus'
        if (type === 'TRAINING') return 'Pelatihan'
        if (type === 'LEARNING_PATH') return 'Learning Path'
        return type
    }

    const getUrl = (type: string, itemId: string) => {
        if (type === 'COURSE') return `/portal/my-courses/${itemId}`
        if (type === 'TRAINING') return `/portal/trainings/${itemId}`
        if (type === 'LEARNING_PATH') return `/portal/learning-paths/${itemId}`
        return '#'
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tugas Wajib Saya</h1>
                <p className="text-muted-foreground mt-2">
                    Daftar pembelajaran yang ditugaskan secara wajib oleh perusahaan. Selesaikan sebelum batas waktu (Due Date) yang ditentukan.
                </p>
            </div>

            {!res.success || !res.data || res.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-lg bg-card border-dashed">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Hore, Tidak Ada Tugas Wajib!</h3>
                    <p className="text-muted-foreground max-w-sm">Anda telah menyelesaikan semua penugasan wajib atau HR belum menugaskan materi baru kepada Anda.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {res.data.map((target: any) => {
                        const assignment = target.assignment
                        const isOverdue = new Date(assignment.dueDate) < new Date() && target.status !== 'COMPLETED'
                        const isCompleted = target.status === 'COMPLETED'

                        return (
                            <Card key={target.id} className={`flex flex-col overflow-hidden transition-all hover:shadow-md ${isOverdue ? 'border-destructive' : ''} ${isCompleted ? 'opacity-70 grayscale' : ''}`}>
                                <CardHeader className="pb-4 border-b bg-muted/20">
                                    <div className="flex items-start justify-between">
                                        <Badge variant="destructive" className="uppercase font-bold tracking-wider rounded-sm px-2">Wajib</Badge>
                                        {isCompleted ? (
                                            <Badge className="bg-green-600">Selesai</Badge>
                                        ) : isOverdue ? (
                                            <Badge variant="destructive">Terlambat</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Menunggu</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pt-6 pb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getTypeIcon(assignment.type)}
                                        <span className="text-xs font-semibold uppercase text-muted-foreground">{getTypeLabel(assignment.type)}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-4 line-clamp-2">{assignment.title}</h3>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <CalendarDays className="w-4 h-4" />
                                            <span>Mulai: {format(new Date(assignment.startDate), 'dd MMMM yyyy', { locale: idLocale })}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm font-medium ${isOverdue ? 'text-destructive' : 'text-primary'}`}>
                                            <CalendarDays className="w-4 h-4" />
                                            <span>Tenggat: {format(new Date(assignment.dueDate), 'dd MMMM yyyy', { locale: idLocale })}</span>
                                        </div>
                                    </div>
                                    {isCompleted && target.completedAt && (
                                        <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                                            Diselesaikan pada: {format(new Date(target.completedAt), 'dd MMM yyyy')}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-4 border-t bg-muted/5">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant={isCompleted ? 'outline' : 'default'}
                                    >
                                        <Link href={getUrl(assignment.type, assignment.itemId)}>
                                            {isCompleted ? 'Review Ulang' : 'Mulai Belajar'}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
