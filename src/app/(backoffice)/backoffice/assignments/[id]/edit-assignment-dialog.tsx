'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { updateAssignmentDates } from '@/lib/actions/assignments'
import { format } from 'date-fns'
import { Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface EditAssignmentDialogProps {
    assignmentId: string
    currentStartDate: Date
    currentDueDate: Date
}

export function EditAssignmentDialog({ assignmentId, currentStartDate, currentDueDate }: EditAssignmentDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [startDate, setStartDate] = useState(format(new Date(currentStartDate), 'yyyy-MM-dd'))
    const [dueDate, setDueDate] = useState(format(new Date(currentDueDate), 'yyyy-MM-dd'))
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!startDate || !dueDate) {
            toast.error('Tanggal mulai dan tenggat waktu wajib diisi')
            return
        }

        if (new Date(startDate) > new Date(dueDate)) {
            toast.error('Tanggal mulai tidak boleh melebihi tenggat waktu')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await updateAssignmentDates(assignmentId, new Date(startDate), new Date(dueDate))
            if (res.success) {
                toast.success('Berhasil memperbarui periode penugasan')
                setOpen(false)
                router.refresh()
            } else {
                toast.error(res.error || 'Gagal memperbarui penugasan')
            }
        } catch (error) {
            toast.error('Terjadi kesalahan pada server')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Periode
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Periode Penugasan</DialogTitle>
                    <DialogDescription>
                        Ubah tanggal mulai dan batas waktu untuk penugasan ini. Perubahan ini akan langsung berlaku pada seluruh peserta yang ditugaskan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-startDate">Tanggal Mulai</Label>
                        <Input
                            id="edit-startDate"
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-dueDate">Batas Waktu (Due Date)</Label>
                        <Input
                            id="edit-dueDate"
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            min={startDate || undefined}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
