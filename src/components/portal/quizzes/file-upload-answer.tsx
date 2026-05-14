'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Upload, X, FileText, FileImage, FileVideo, File, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  fileName: string
  fileKey: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

interface FileUploadAnswerProps {
  attemptId: string
  questionId: string
  allowedFileTypes: string[]
  maxFileSizeMB: number
  maxFileCount: number
  uploadInstructions?: string
  existingFiles?: UploadedFile[]
  disabled?: boolean
  onFilesChange?: (files: UploadedFile[]) => void
}

export function FileUploadAnswer({
  attemptId,
  questionId,
  allowedFileTypes,
  maxFileSizeMB,
  maxFileCount,
  uploadInstructions,
  existingFiles = [],
  disabled = false,
  onFilesChange,
}: FileUploadAnswerProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const canUploadMore = files.length < maxFileCount

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return FileImage
    if (['mp4', 'avi', 'mov'].includes(ext || '')) return FileVideo
    if (['pdf', 'doc', 'docx'].includes(ext || '')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowedFileTypes.includes(ext)) {
      return `Tipe file tidak diperbolehkan. Tipe yang diperbolehkan: ${allowedFileTypes.join(', ')}`
    }

    const maxSizeBytes = maxFileSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `Ukuran file melebihi batas maksimal ${maxFileSizeMB}MB`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    if (!canUploadMore) {
      toast.error(`Maksimal ${maxFileCount} file`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('attemptId', attemptId)
      formData.append('questionId', questionId)
      formData.append('file', file)

      const response = await fetch('/api/quiz/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const newFiles = [...files, result.data]
        setFiles(newFiles)
        onFilesChange?.(newFiles)
        toast.success('File berhasil diupload')
      } else {
        toast.error(result.error || 'Gagal mengupload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Terjadi kesalahan saat mengupload file')
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (fileKey: string) => {
    try {
      const response = await fetch('/api/quiz/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, questionId, fileKey }),
      })

      const result = await response.json()

      if (result.success) {
        const newFiles = files.filter((f) => f.fileKey !== fileKey)
        setFiles(newFiles)
        onFilesChange?.(newFiles)
        toast.success('File berhasil dihapus')
      } else {
        toast.error(result.error || 'Gagal menghapus file')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Terjadi kesalahan saat menghapus file')
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled || !canUploadMore) return

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        uploadFile(droppedFiles[0])
      }
    },
    [disabled, canUploadMore]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      {uploadInstructions && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-950">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-blue-900 dark:text-blue-100">{uploadInstructions}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Tipe file: {allowedFileTypes.join(', ').toUpperCase()} | Maks: {maxFileSizeMB}MB | Jumlah: {maxFileCount} file
      </div>

      {/* Uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.fileName)
            return (
              <div
                key={file.fileKey}
                className="flex items-center justify-between rounded-lg border bg-slate-50 p-3 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {!disabled && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteFile(file.fileKey)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload area */}
      {canUploadMore && !disabled && (
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-slate-300 hover:border-primary hover:bg-primary/5 dark:border-slate-700',
            uploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={`file-input-${questionId}`}
            className="hidden"
            accept={allowedFileTypes.map((t) => `.${t}`).join(',')}
            onChange={handleFileInput}
            disabled={uploading}
          />
          <label htmlFor={`file-input-${questionId}`} className="cursor-pointer">
            {uploading ? (
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            ) : (
              <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            )}
            <p className="mt-2 text-sm font-medium">
              {uploading ? 'Mengupload...' : 'Drag & drop file di sini atau klik untuk browse'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {files.length} / {maxFileCount} file terupload
            </p>
          </label>
        </div>
      )}

      {!canUploadMore && !disabled && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
          Maksimal {maxFileCount} file sudah terupload
        </div>
      )}

      {disabled && files.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Tidak ada file yang diupload
        </div>
      )}
    </div>
  )
}
