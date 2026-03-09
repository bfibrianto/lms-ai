import { Metadata } from 'next'
import { getAssignments } from '@/lib/actions/assignments'
import { getCourses } from '@/lib/actions/courses'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search, Target, Users } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
    title: 'Managemen Penugasan | LMS Backoffice',
}

export default async function AssignmentsPage(props: {
    searchParams: Promise<{ search?: string; page?: string }>
}) {
    const searchParams = await props.searchParams
    const search = searchParams.search ?? ''
    const page = Number(searchParams.page) || 1

    const res = await getAssignments({ search, page })

    const getTypeLabel = (type: string) => {
        if (type === 'COURSE') return 'Kursus'
        if (type === 'TRAINING') return 'Pelatihan'
        if (type === 'LEARNING_PATH') return 'Learning Path'
        return type
    }

    const getTypeColor = (type: string) => {
        if (type === 'COURSE') return 'bg-blue-100 text-blue-800 border-blue-200'
        if (type === 'TRAINING') return 'bg-violet-100 text-violet-800 border-violet-200'
        if (type === 'LEARNING_PATH') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
        return ''
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Penugasan (Mandatory)</h1>
                    <p className="text-muted-foreground mt-2">
                        Kelola penugasan kursus, pelatihan, dan program pembelajaran wajib untuk karyawan.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/backoffice/assignments/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Penugasan Baru
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Item</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Target Karyawan</TableHead>
                            <TableHead>Tanggal Mulai</TableHead>
                            <TableHead>Tenggat Waktu</TableHead>
                            <TableHead>Ditugaskan Oleh</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {res.success && res.data?.assignments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    <Target className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                    Belum ada penugasan yang dibuat.
                                </TableCell>
                            </TableRow>
                        ) : (
                            res.data?.assignments.map((assignment: any) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">
                                        {assignment.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getTypeColor(assignment.type)}>
                                            {getTypeLabel(assignment.type)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{assignment._count.assignees} Karyawan</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span>
                                            {format(new Date(assignment.startDate), 'dd MMM yyyy', { locale: id })}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={new Date(assignment.dueDate) < new Date() ? 'text-destructive font-medium' : ''}>
                                            {format(new Date(assignment.dueDate), 'dd MMM yyyy', { locale: id })}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {assignment.assignedBy.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/backoffice/assignments/${assignment.id}`}>
                                                Lihat Detail
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
