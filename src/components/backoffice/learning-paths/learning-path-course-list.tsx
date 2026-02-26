'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updatePathCourses } from '@/lib/actions/learning-paths'

interface MinimalCourse {
    id: string
    title: string
    level: string
    thumbnail: string | null
}

interface PathCourseItem {
    courseId: string
    course: MinimalCourse
    order: number
}

interface Props {
    pathId: string
    initialCourses: any[] // PathCourseDetail[]
    allCourses: MinimalCourse[]
}

export function LearningPathCourseList({ pathId, initialCourses, allCourses }: Props) {
    const router = useRouter()
    const [courses, setCourses] = useState<PathCourseItem[]>(
        initialCourses.map((c) => ({
            courseId: c.courseId,
            course: c.course,
            order: c.order,
        }))
    )
    const [selectedCourseId, setSelectedCourseId] = useState<string>('')
    const [isSaving, setIsSaving] = useState(false)

    // Opsi kursus yang belum ada di path ini
    const availableCourses = allCourses.filter(
        (ac) => !courses.some((c) => c.courseId === ac.id)
    )

    const handleAddCourse = () => {
        if (!selectedCourseId) return
        const courseToAdd = allCourses.find((c) => c.id === selectedCourseId)
        if (!courseToAdd) return

        setCourses([
            ...courses,
            {
                courseId: courseToAdd.id,
                course: courseToAdd,
                order: courses.length,
            },
        ])
        setSelectedCourseId('')
    }

    const handleRemoveCourse = (index: number) => {
        const newCourses = [...courses]
        newCourses.splice(index, 1)
        setCourses(newCourses)
    }

    const handleMoveUp = (index: number) => {
        if (index === 0) return
        const newCourses = [...courses]
        const temp = newCourses[index - 1]
        newCourses[index - 1] = newCourses[index]
        newCourses[index] = temp
        setCourses(newCourses)
    }

    const handleMoveDown = (index: number) => {
        if (index === courses.length - 1) return
        const newCourses = [...courses]
        const temp = newCourses[index + 1]
        newCourses[index + 1] = newCourses[index]
        newCourses[index] = temp
        setCourses(newCourses)
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const payload = courses.map((c, i) => ({
                courseId: c.courseId,
                order: i, // Rekalkulasi order sesuai index UI
            }))

            const res = await updatePathCourses(pathId, payload)
            if (res.error) throw new Error(res.error)

            toast.success('Urutan kursus berhasil disimpan')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan urutan kursus')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Tambah Kursus ke Path</label>
                            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kursus..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCourses.length === 0 ? (
                                        <SelectItem value="empty" disabled>Tidak ada kursus tersedia</SelectItem>
                                    ) : (
                                        availableCourses.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.title}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAddCourse} disabled={!selectedCourseId || selectedCourseId === 'empty'}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {courses.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        Belum ada kursus dalam path ini.
                    </div>
                ) : (
                    courses.map((pc, index) => (
                        <div
                            key={pc.courseId}
                            className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1 items-center justify-center p-2 bg-muted rounded">
                                    <span className="text-xs font-semibold text-muted-foreground">Urutan</span>
                                    <span className="text-lg font-bold">{index + 1}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{pc.course.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Level: {pc.course.level}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    title="Pindah ke Atas"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === courses.length - 1}
                                    title="Pindah ke Bawah"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleRemoveCourse(index)}
                                    title="Hapus dari Path"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving || courses.length === 0}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Urutan Kursus
                </Button>
            </div>
        </div>
    )
}
