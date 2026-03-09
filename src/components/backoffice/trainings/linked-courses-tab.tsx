'use client'

import { useState, useEffect } from 'react'
import { getLinkedCourses, linkCoursesToTraining } from '@/lib/actions/trainings'
import { getCourses } from '@/lib/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Link2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function LinkedCoursesTab({ trainingId }: { trainingId: string }) {
    const [courses, setCourses] = useState<any[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [duration, setDuration] = useState<number>(14)
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            try {
                const [allCoursesRes, linkedRes] = await Promise.all([
                    getCourses({ status: 'PUBLISHED', pageSize: 100 }),
                    getLinkedCourses(trainingId)
                ])

                if (!mounted) return

                if (allCoursesRes.courses) {
                    setCourses(allCoursesRes.courses)
                }

                if (linkedRes.success && linkedRes.data) {
                    const linkedIds = linkedRes.data.map((l: any) => l.courseId)
                    setSelectedIds(linkedIds)
                    if (linkedRes.data.length > 0) {
                        setDuration(linkedRes.data[0].accessDurationInDays)
                    }
                }
            } catch (error) {
                toast.error('Gagal memuat data course')
            } finally {
                if (mounted) setIsLoading(false)
            }
        }

        fetchData()
        return () => { mounted = false }
    }, [trainingId])

    const handleToggle = (id: string, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(x => x !== id)
        )
    }

    const handleSave = async () => {
        if (duration < 1) {
            toast.error('Durasi akses minimal 1 hari')
            return
        }

        setIsSaving(true)
        try {
            const res = await linkCoursesToTraining(trainingId, selectedIds, duration)
            if (res.success) {
                toast.success('Materi pendukung berhasil disimpan')
            } else {
                toast.error(res.error || 'Gagal menyimpan data')
            }
        } catch (e) {
            toast.error('Koneksi bermasalah')
        } finally {
            setIsSaving(false)
        }
    }

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40 border rounded-md">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Pengaturan Materi Pendukung</h3>
                <p className="text-sm text-muted-foreground">
                    Pilih kursus yang menjadi referensi atau prasyarat untuk pelatihan ini.
                    Peserta pelatihan akan mendapatkan akses <b>sementara</b> ke kursus ini.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left: Configuration form */}
                <div className="space-y-4 md:col-span-1 border rounded-lg p-4 bg-muted/20">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Masa Berlaku Akses (Hari)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="duration"
                                type="number"
                                min={1}
                                value={duration}
                                onChange={e => setDuration(parseInt(e.target.value) || 0)}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">Hari setelah enrolled</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Setelah masa berlaku habis, peserta tidak bisa mengakses kursus ini lagi.
                        </p>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Link2 className="mr-2 h-4 w-4" />
                            Simpan Tautan
                        </Button>
                    </div>
                </div>

                {/* Right: Course Selection */}
                <div className="space-y-4 md:col-span-2 border rounded-lg p-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari kursus..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                        {filteredCourses.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground text-sm">
                                Tidak ada kursus ditemukan.
                            </div>
                        ) : (
                            filteredCourses.map(course => (
                                <label
                                    key={course.id}
                                    className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <Checkbox
                                        checked={selectedIds.includes(course.id)}
                                        onCheckedChange={(checked) => handleToggle(course.id, !!checked)}
                                        className="mt-1"
                                    />
                                    <div className="flex flex-col gap-1 w-full">
                                        <span className="text-sm font-medium leading-none">{course.title}</span>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-[10px] uppercase font-normal">{course.level}</Badge>
                                        </div>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
