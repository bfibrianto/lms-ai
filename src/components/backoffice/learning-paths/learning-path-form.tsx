'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateLearningPathSchema, type CreateLearningPathInput } from '@/lib/validations/learning-paths'
import { createLearningPath, updateLearningPath } from '@/lib/actions/learning-paths'
import type { LearningPathDetail } from '@/types/learning-paths'
import { FileUploader } from '@/components/shared/upload-button'

interface LearningPathFormProps {
    initialData?: LearningPathDetail
    isEdit?: boolean
}

export function LearningPathForm({ initialData, isEdit }: LearningPathFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        initialData?.thumbnail || null
    )

    const form = useForm<CreateLearningPathInput>({
        resolver: zodResolver(CreateLearningPathSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            status: initialData?.status || 'DRAFT',
            thumbnail: null,
        },
    })

    async function onSubmit(data: CreateLearningPathInput) {
        try {
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append('title', data.title)
            if (data.description) formData.append('description', data.description)
            formData.append('status', data.status)
            if (data.thumbnail instanceof File) {
                formData.append('thumbnail', data.thumbnail)
            } else if (typeof data.thumbnail === 'string' && data.thumbnail) {
                formData.append('thumbnail', data.thumbnail) // send existing URL if changed via URL input instead of file
            }

            if (isEdit && initialData) {
                // If user changed thumbnail completely, or cleared it
                if (data.thumbnail === null) {
                    formData.append('removeThumbnail', 'true')
                }
                const res = await updateLearningPath(initialData.id, formData)
                if (res.error) throw new Error(res.error)
                toast.success('Learning Path berhasil diupdate')
                router.refresh()
            } else {
                const res = await createLearningPath(formData)
                if (res.error) throw new Error(res.error)
                toast.success('Learning Path berhasil dibuat')
                router.push(`/backoffice/learning-paths/${res.id}/edit`)
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan data')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Judul Path</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: Frontend Developer Bootcamp" {...field} />
                            </FormControl>
                            <FormDescription>
                                Nama learning path yang akan dilihat oleh siswa.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ceritakan tujuan jalur pembelajaran ini..."
                                    className="min-h-[120px]"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draf (Belum Publik)</SelectItem>
                                    <SelectItem value="PUBLISHED">Diterbitkan (Publik)</SelectItem>
                                    <SelectItem value="ARCHIVED">Arsip (Sembunyikan)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail Path (Gambar)</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <FileUploader
                                        currentImageUrl={typeof field.value === 'string' ? field.value : undefined}
                                        onUploadSuccess={(url) => {
                                            field.onChange(url)
                                            setThumbnailPreview(url)
                                        }}
                                        folder="learning-paths"
                                    />
                                    {(thumbnailPreview || field.value) && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                field.onChange(null)
                                                setThumbnailPreview(null)
                                            }}
                                        >
                                            Hapus Gambar
                                        </Button>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Unggah gambar thumbnail (landscape direkomendasikan). Format didukung: JPG, PNG, WEBP. Maks 5MB.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Simpan Perubahan' : 'Buat Path'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
