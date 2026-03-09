import { Metadata } from 'next'
import { getAssignmentById } from '@/lib/actions/assignments'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Progress } from '@/components/ui/progress'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Target, CalendarDays, CheckCircle2, Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EditAssignmentDialog } from './edit-assignment-dialog'
import { ParticipantActions } from './participant-actions'

export const metadata: Metadata = {
    title: 'Detail Penugasan | LMS Backoffice',
}

export default async function AssignmentDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const res = await getAssignmentById(params.id)

    if (!res.success || !res.data) {
        notFound()
    }

    const assignment = res.data
    const assignees = assignment.assignees

    const completedCount = assignees.filter((a) => a.status === 'COMPLETED').length
    const progressPercentage = assignees.length > 0 ? Math.round((completedCount / assignees.length) * 100) : 0

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <Badge className="bg-green-600">Selesai</Badge>
            case 'OVERDUE': return <Badge variant="destructive">Terlambat</Badge>
            case 'IN_PROGRESS': return <Badge className="bg-blue-500">Dalam Proses</Badge>
            default: return <Badge variant="secondary">Belum Mulai</Badge>
        }
    }

    const getTypeLabel = (type: string) => {
        if (type === 'COURSE') return 'Kursus'
        if (type === 'TRAINING') return 'Pelatihan'
        if (type === 'LEARNING_PATH') return 'Learning Path'
        return type
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/backoffice/assignments">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
                        <Badge variant="outline" className="uppercase">{getTypeLabel(assignment.type)}</Badge>
                        <Button variant="ghost" size="sm" asChild className="ml-2">
                            <Link href={`/backoffice/${assignment.type === 'COURSE' ? 'courses' : assignment.type === 'TRAINING' ? 'trainings' : 'learning-paths'}/${assignment.itemId}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Modul
                            </Link>
                        </Button>
                        <EditAssignmentDialog
                            assignmentId={assignment.id}
                            currentStartDate={assignment.startDate}
                            currentDueDate={assignment.dueDate}
                        />
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                        ID: {assignment.id} • Ditugaskan oleh {assignment.assignedBy.name} pada {format(new Date(assignment.createdAt), 'dd MMM yyyy', { locale: idLocale })}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Periode Penugasan</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-1">
                            <div className="text-sm font-medium text-muted-foreground">
                                Mulai: {format(new Date(assignment.startDate), 'dd MMM yyyy', { locale: idLocale })}
                            </div>
                            <div className={`text-xl font-bold ${new Date(assignment.dueDate) < new Date() ? 'text-destructive' : ''}`}>
                                Tenggat: {format(new Date(assignment.dueDate), 'dd MMM yyyy', { locale: idLocale })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assignees.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progress Keseluruhan</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">{progressPercentage}%</div>
                        <Progress value={progressPercentage} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">Daftar Karyawan</h3>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Karyawan</TableHead>
                            <TableHead>Departemen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress Individu</TableHead>
                            <TableHead>Waktu Selesai</TableHead>
                            <TableHead className="w-[80px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignees.map((target) => (
                            <TableRow key={target.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{target.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{target.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{target.user.department || '-'}</TableCell>
                                <TableCell>{getStatusBadge(target.status)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-8">{target.progress}%</span>
                                        <Progress value={target.progress} className="h-2 w-16" />
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {target.completedAt ? (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                                            {format(new Date(target.completedAt), 'dd MMM yyyy')}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            -
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <ParticipantActions
                                        assignmentId={assignment.id}
                                        userId={target.userId}
                                        userName={target.user.name}
                                        itemId={assignment.itemId}
                                        itemType={assignment.type}
                                        isCompleted={target.status === 'COMPLETED'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
