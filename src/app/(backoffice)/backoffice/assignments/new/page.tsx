'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createAssignment } from '@/lib/actions/assignments'
import { getCourses } from '@/lib/actions/courses'
import { getTrainings } from '@/lib/actions/trainings'
import { getLearningPaths } from '@/lib/actions/learning-paths'
import { getUsers } from '@/lib/actions/users'
import { AssignmentType } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Users, Target, CalendarDays, Search } from 'lucide-react'
import Link from 'next/link'

export default function NewAssignmentPage() {
    const router = useRouter()

    // Form State
    const [step, setStep] = useState(1)
    const [type, setType] = useState<AssignmentType>('COURSE')
    const [itemId, setItemId] = useState<string>('')
    const [itemTitle, setItemTitle] = useState<string>('')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [startDate, setStartDate] = useState<string>('')
    const [dueDate, setDueDate] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data State
    const [items, setItems] = useState<any[]>([])
    const [employees, setEmployees] = useState<any[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [itemsSearch, setItemsSearch] = useState('')
    const [usersSearch, setUsersSearch] = useState('')

    // Fetch Items when type changes
    useEffect(() => {
        let mounted = true
        const fetchItems = async () => {
            setIsLoadingData(true)
            try {
                if (type === 'COURSE') {
                    const res = await getCourses({ pageSize: 100 })
                    if (mounted) setItems(res.courses || [])
                } else if (type === 'TRAINING') {
                    const res = await getTrainings({})
                    if (mounted) setItems(res.trainings || [])
                } else if (type === 'LEARNING_PATH') {
                    const res = await getLearningPaths()
                    if (mounted) setItems((res as any).learningPaths || res || []) // depending on actual return type structure
                }
            } catch (error) {
                toast.error('Gagal memuat daftar item')
            } finally {
                if (mounted) setIsLoadingData(false)
            }
        }

        setItemId('')
        setItemTitle('')
        fetchItems()
        return () => { mounted = false }
    }, [type])

    // Fetch Employees on Mount
    useEffect(() => {
        let mounted = true
        const fetchEmployees = async () => {
            try {
                const res = await getUsers({ role: 'EMPLOYEE', pageSize: 1000 })
                if (mounted) setEmployees(res.users || [])
            } catch (error) {
                toast.error('Gagal memuat daftar karyawan')
            }
        }
        fetchEmployees()
        return () => { mounted = false }
    }, [])

    const handleNext = () => {
        if (step === 1 && !itemId) {
            toast.error('Pilih item yang ingin ditugaskan.')
            return
        }
        if (step === 2 && selectedUsers.length === 0) {
            toast.error('Pilih minimal satu karyawan.')
            return
        }
        setStep(prev => prev + 1)
    }

    const handleBack = () => setStep(prev => prev - 1)

    const handleSubmit = async () => {
        if (!startDate || !dueDate) {
            toast.error('Tentukan tanggal mulai dan batas waktu penyelesaian.')
            return
        }
        if (new Date(startDate) > new Date(dueDate)) {
            toast.error('Tanggal mulai tidak boleh lebih dari batas waktu penyelesaian.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await createAssignment({
                type,
                itemId,
                title: itemTitle,
                userIds: selectedUsers,
                startDate: new Date(startDate),
                dueDate: new Date(dueDate)
            })

            if (res.success) {
                toast.success('Penugasan berhasil dibuat')
                router.push('/backoffice/assignments')
            } else {
                toast.error(res.error || 'Terjadi kesalahan')
            }
        } catch (error) {
            toast.error('Koneksi bermasalah')
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleUser = (id: string, checked: boolean) => {
        if (id === 'all') {
            setSelectedUsers(checked ? filteredEmployees.map(e => e.id) : [])
            return
        }
        setSelectedUsers(prev =>
            checked ? [...prev, id] : prev.filter(x => x !== id)
        )
    }

    const filteredItems = items.filter(c => c.title?.toLowerCase().includes(itemsSearch.toLowerCase()))
    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(usersSearch.toLowerCase()) ||
        (e.department && e.department.toLowerCase().includes(usersSearch.toLowerCase()))
    )

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/backoffice/assignments">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Buat Penugasan Baru</h1>
                    <p className="text-muted-foreground mt-1">Langkah {step} dari 3</p>
                </div>
            </div>

            <div className="border rounded-lg bg-card overflow-hidden">
                {/* -------------------- STEP 1: Pilih Item -------------------- */}
                {step === 1 && (
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Target className="w-5 h-5" /> 1. Pilih Tipe Penugasan
                            </Label>
                            <div className="flex gap-4">
                                {['COURSE', 'TRAINING', 'LEARNING_PATH'].map(t => (
                                    <Button
                                        key={t}
                                        type="button"
                                        variant={type === t ? 'default' : 'outline'}
                                        onClick={() => setType(t as AssignmentType)}
                                    >
                                        {t === 'COURSE' ? 'Kursus' : t === 'TRAINING' ? 'Pelatihan' : 'Learning Path'}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-semibold">Pilih Item Spesifik</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    placeholder="Cari berdasarkan judul..."
                                    value={itemsSearch}
                                    onChange={e => setItemsSearch(e.target.value)}
                                />
                            </div>

                            <div className="relative border rounded-md max-h-[300px] overflow-y-auto p-2 space-y-2">
                                {isLoadingData ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                ) : filteredItems.length === 0 ? (
                                    <div className="text-center p-8 text-muted-foreground">Tidak ada data ditemukan.</div>
                                ) : (
                                    filteredItems.map(item => (
                                        <label
                                            key={item.id}
                                            className={`flex items-start gap-3 p-3 rounded-md cursor-pointer border hover:bg-muted/50 transition-colors ${itemId === item.id ? 'bg-primary/5 border-primary' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="itemSelection"
                                                className="mt-1"
                                                checked={itemId === item.id}
                                                onChange={() => {
                                                    setItemId(item.id)
                                                    setItemTitle(item.title)
                                                }}
                                            />
                                            <div>
                                                <h4 className="font-medium text-sm">{item.title}</h4>
                                                {type === 'TRAINING' && (
                                                    <p className="text-xs text-muted-foreground">Kapasitas: {item.capacity || 'Unlimited'} • Status: {item.status}</p>
                                                )}
                                                {type === 'COURSE' && (
                                                    <p className="text-xs text-muted-foreground">Level: {item.level}</p>
                                                )}
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------- STEP 2: Pilih Target -------------------- */}
                {step === 2 && (
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Users className="w-5 h-5" /> 2. Pilih Target Karyawan
                                </Label>
                                <span className="text-sm text-primary font-medium">{selectedUsers.length} Terpilih</span>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    placeholder="Filter nama atau departemen..."
                                    value={usersSearch}
                                    onChange={e => setUsersSearch(e.target.value)}
                                />
                            </div>

                            <div className="border rounded-md">
                                <div className="p-3 border-b bg-muted/30 flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredEmployees.length && filteredEmployees.length > 0}
                                        onCheckedChange={(checked) => toggleUser('all', !!checked)}
                                    />
                                    <span className="text-sm font-medium">Pilih Semua ({filteredEmployees.length})</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                                    {filteredEmployees.length === 0 ? (
                                        <div className="text-center p-8 text-muted-foreground">Tidak ada karyawan (Role EMPLOYEE) ditemukan.</div>
                                    ) : (
                                        filteredEmployees.map(emp => (
                                            <label
                                                key={emp.id}
                                                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                                            >
                                                <Checkbox
                                                    checked={selectedUsers.includes(emp.id)}
                                                    onCheckedChange={(checked) => toggleUser(emp.id, !!checked)}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium leading-none">{emp.name}</span>
                                                    <span className="text-xs text-muted-foreground mt-1">{emp.department || 'Departemen Belum Diatur'} • {emp.email}</span>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------- STEP 3: Setup Deadline -------------------- */}
                {step === 3 && (
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <CalendarDays className="w-5 h-5" /> 3. Tentukan Tenggat Waktu (Due Date)
                            </Label>

                            <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="font-semibold">
                                        Judul Penugasan <span className="text-muted-foreground font-normal">(Opsional)</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder={`Contoh: Penugasan: ${itemTitle}`}
                                        value={itemTitle}
                                        onChange={e => setItemTitle(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Jika dikosongkan, judul akan menggunakan nama asli modul.
                                    </p>
                                </div>
                                <div className="pt-2 border-t">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Item Penugasan Asli</h4>
                                    <p className="font-semibold">{items.find(i => i.id === itemId)?.title}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Karyawan Ditugaskan</h4>
                                    <p className="font-semibold">{selectedUsers.length} Orang</p>
                                </div>
                                <div className="pt-2 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="startDate" className="mb-2 block">Tanggal Mulai <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dueDate" className="mb-2 block">Batas Waktu Penyelesaian <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={dueDate}
                                            onChange={e => setDueDate(e.target.value)}
                                            className="w-full"
                                            min={startDate || undefined}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Setelah opsi batas waktu terlewati, status penugasan akan diberi status Terlambat (Overdue).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 border-t bg-muted/10 flex justify-between items-center">
                    <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                        Kembali
                    </Button>
                    {step < 3 ? (
                        <Button onClick={handleNext}>
                            Lanjut
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Simpan Penugasan
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
