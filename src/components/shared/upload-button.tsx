'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, File, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploaderProps {
    onUploadSuccess: (url: string) => void
    onUploadError?: (error: Error) => void
    accept?: string
    maxSizeMB?: number
    folder?: string
    disabled?: boolean
    currentImageUrl?: string | null
}

export function FileUploader({
    onUploadSuccess,
    onUploadError,
    accept = 'image/*',
    maxSizeMB = 5,
    folder = 'media',
    disabled = false,
    currentImageUrl,
}: FileUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Ukuran file maksimal adalah ${maxSizeMB}MB`)
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        setIsUploading(true)
        setUploadProgress(10) // Mock starting progress

        try {
            // 1. Get Presigned URL
            const res = await fetch('/api/upload/presigned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    folder,
                }),
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || 'Gagal mendapatkan auth upload URL')
            }

            const { url, fileUrl } = await res.json()
            setUploadProgress(50)

            // 2. Upload file directly to S3 / MinIO
            const uploadRes = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            })

            if (!uploadRes.ok) {
                throw new Error('Gagal mengunggah file ke server penyimpanan')
            }

            setUploadProgress(100)

            // Tunggu sebentar agar animasi penuh terlihat
            setTimeout(() => {
                setIsUploading(false)
                setUploadProgress(0)
                onUploadSuccess(fileUrl)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }, 500)

        } catch (err: any) {
            console.error(err)
            setIsUploading(false)
            setUploadProgress(0)
            if (fileInputRef.current) fileInputRef.current.value = ''

            const errorObj = err instanceof Error ? err : new Error('Terjadi kesalahan')
            if (onUploadError) onUploadError(errorObj)
            toast.error(errorObj.message)
        }
    }

    return (
        <div className="w-full">
            {/* Jika asalnya sudah ada gambarnya */}
            {currentImageUrl && !isUploading && (
                <div className="relative mb-4 overflow-hidden rounded-md border aspect-video max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentImageUrl}
                        alt="Uploaded Preview"
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            {/* Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors
          ${isUploading ? 'bg-muted/50 border-muted-foreground/20' : 'hover:bg-muted/50 border-muted-foreground/20'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
                onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={disabled || isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <div className="text-sm font-medium">Mengunggah... {uploadProgress}%</div>
                        <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center text-muted-foreground">
                        <UploadCloud className="h-8 w-8 mb-2" />
                        <p className="text-sm font-semibold">Klik untuk memilih file</p>
                        <p className="text-xs">
                            Mendukung {accept.replace('/*', '')} (Maks. {maxSizeMB}MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
