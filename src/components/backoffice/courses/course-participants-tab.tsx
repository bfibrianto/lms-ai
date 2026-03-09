'use client'

import { useState, useEffect } from 'react'
import { getCourseParticipants, getParticipantDetail } from '@/lib/actions/courses'
import type { ParticipantListItem, ParticipantDetail } from '@/types/courses'
import { ParticipantDetailSheet } from './participant-detail-sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface CourseParticipantsTabProps {
    courseId: string
}

export function CourseParticipantsTab({ courseId }: CourseParticipantsTabProps) {
    const [participants, setParticipants] = useState<ParticipantListItem[]>([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Sheet State
    const [sheetOpen, setSheetOpen] = useState(false)
    const [selectedDetail, setSelectedDetail] = useState<ParticipantDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    // Fetch Participants on Mount
    useEffect(() => {
        let isMounted = true
        const fetchParticipants = async () => {
            try {
                const result = await getCourseParticipants(courseId)
                if (result.success && result.data && isMounted) {
                    setParticipants(result.data.participants)
                } else if (!result.success) {
                    toast.error(result.error || 'Gagal memuat daftar peserta')
                }
            } catch (e) {
                toast.error('Terjadi kesalahan jaringan')
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }
        fetchParticipants()
        return () => { isMounted = false }
    }, [courseId])

    const filteredParticipants = participants.filter((p) => {
        const term = search.toLowerCase()
        return p.user.name.toLowerCase().includes(term) || p.user.email.toLowerCase().includes(term)
    })

    const openParticipantDetail = async (userId: string) => {
        setSheetOpen(true)
        setDetailLoading(true)
        setSelectedDetail(null)

        try {
            const result = await getParticipantDetail(courseId, userId)
            if (result.success && result.data) {
                setSelectedDetail(result.data)
            } else if (!result.success) {
                toast.error(result.error || 'Gagal memuat detail peserta')
                setSheetOpen(false)
            }
        } catch (e) {
            toast.error('Terjadi kesalahan sistem')
            setSheetOpen(false)
        } finally {
            setDetailLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center border rounded-md">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau email..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Total: {filteredParticipants.length} Peserta
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama & Role</TableHead>
                            <TableHead>Tanggal Enroll</TableHead>
                            <TableHead>Penyelesaian</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParticipants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Belum ada peserta yang cocok.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredParticipants.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{p.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{p.user.email}</span>
                                            <Badge variant="outline" className="w-fit mt-1 text-[10px] uppercase">
                                                {p.user.role}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {format(new Date(p.enrolledAt), 'dd MMM yyyy', { locale: id })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Progress value={p.progressPercentage} className="h-2 w-24" />
                                            <span className="text-xs text-muted-foreground">
                                                {p.progressPercentage}% ({p.completedLessons}/{p.totalLessons})
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openParticipantDetail(p.user.id)}
                                        >
                                            Lihat Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ParticipantDetailSheet
                isOpen={sheetOpen}
                onClose={() => setSheetOpen(false)}
                detail={selectedDetail}
                isLoading={detailLoading}
            />
        </div>
    )
}
