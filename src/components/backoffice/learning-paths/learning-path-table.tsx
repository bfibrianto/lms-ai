'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Layers, Route } from 'lucide-react'
import type { LearningPathListItem } from '@/types/learning-paths'
import type { LearningPathStatus } from '@/generated/prisma/client'

const STATUS_LABELS: Record<LearningPathStatus, string> = {
    DRAFT: 'Draf',
    PUBLISHED: 'Diterbitkan',
    ARCHIVED: 'Diarsipkan',
}

const STATUS_BADGE_VARIANT: Record<LearningPathStatus, 'default' | 'secondary' | 'outline'> = {
    DRAFT: 'secondary',
    PUBLISHED: 'default',
    ARCHIVED: 'outline',
}

interface LearningPathTableProps {
    paths: LearningPathListItem[]
    canEdit: boolean
}

export function LearningPathTable({
    paths,
    canEdit,
}: LearningPathTableProps) {
    return (
        <div className="space-y-4">
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Learning Path</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Kursus</TableHead>
                            <TableHead className="text-center">Siswa Enrolled</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paths.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-10 text-center text-muted-foreground"
                                >
                                    Tidak ada learning path ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            paths.map((path) => (
                                <TableRow key={path.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {path.thumbnail ? (
                                                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded">
                                                    <Image
                                                        src={path.thumbnail}
                                                        alt={path.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-muted">
                                                    <Route className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            <span className="font-medium">{path.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_BADGE_VARIANT[path.status]}>
                                            {STATUS_LABELS[path.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {path._count.courses}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {path._count.enrollments}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Manage Courses (Edit Tab) */}
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    aria-label={`Kelola Kursus ${path.title}`}
                                                >
                                                    <Link href={`/backoffice/learning-paths/${path.id}/edit?tab=courses`}>
                                                        <Layers className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {/* Edit Metadata */}
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    aria-label={`Edit metadata ${path.title}`}
                                                >
                                                    <Link href={`/backoffice/learning-paths/${path.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total {paths.length} learning path.</span>
            </div>
        </div>
    )
}
