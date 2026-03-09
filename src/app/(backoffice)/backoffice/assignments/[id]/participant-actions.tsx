'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Trash2, CheckCircle, History, Loader2, BookOpen } from 'lucide-react'
import { removeAssignmentTarget, verifyAssignmentCompletion, getAssigneeHistory } from '@/lib/actions/assignments'
import { toast } from 'sonner'
import { AssignmentType, EnrollmentStatus } from '@/generated/prisma/client'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface ParticipantActionsProps {
    assignmentId: string
    userId: string
    userName: string
    itemId: string
    itemType: AssignmentType
    isCompleted: boolean
}

export function ParticipantActions({ assignmentId, userId, userName, itemId, itemType, isCompleted }: ParticipantActionsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [history, setHistory] = useState<any[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)

    const handleRemove = async () => {
        if (!confirm(`Hapus ${userName} dari penugasan ini?`)) return
        setIsLoading(true)
        const res = await removeAssignmentTarget(assignmentId, userId)
        if (res.success) {
            toast.success('Peserta berhasil dihapus dari penugasan')
        } else {
            toast.error(res.error || 'Gagal menghapus peserta')
        }
        setIsLoading(false)
    }

    const handleVerify = async () => {
        if (!confirm(`Tandai penugasan ${userName} sebagai selesai?`)) return
        setIsLoading(true)
        const res = await verifyAssignmentCompletion(assignmentId, userId)
        if (res.success) {
            toast.success('Penyelesaian berhasil diverifikasi')
        } else {
            toast.error(res.error || 'Gagal memverifikasi')
        }
        setIsLoading(false)
    }

    const handleViewHistory = async () => {
        setIsHistoryOpen(true)
        setLoadingHistory(true)
        const res = await getAssigneeHistory(userId, itemId, itemType)
        if (res.success) {
            setHistory(res.data || [])
        } else {
            toast.error(res.error || 'Gagal memuat riwayat')
        }
        setLoadingHistory(false)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                        <span className="sr-only">Buka menu</span>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi Peserta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isCompleted && (
                        <DropdownMenuItem onSelect={handleVerify}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verifikasi Selesai
                        </DropdownMenuItem>
                    )}
                    {itemType === 'COURSE' && (
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing immediately if needed, or let it close
                            handleViewHistory()
                        }}>
                            <History className="mr-2 h-4 w-4" />
                            Riwayat Belajar
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleRemove} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Peserta
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Riwayat Belajar: {userName}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {loadingHistory ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                Belum ada riwayat (materi diselesaikan).
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {history.map((record, index) => (
                                    <div key={index} className="flex gap-3 text-sm items-start border-b pb-3 last:border-0">
                                        <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{record.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(record.date), 'dd MMM yyyy, HH:mm', { locale: id })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
