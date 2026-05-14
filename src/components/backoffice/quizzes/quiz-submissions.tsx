'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FileText,
  FileImage,
  FileVideo,
  File,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  fileName: string
  fileKey: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
  downloadUrl?: string
}

interface Answer {
  questionId: string
  questionText: string
  questionType: string
  optionId?: string
  essayText?: string
  uploadedFiles?: UploadedFile[]
  score?: number
  feedback?: string
}

interface Submission {
  attemptId: string
  student: {
    id: string
    name: string
    email: string
  }
  score?: number
  passed?: boolean
  submittedAt: string
  answers: Answer[]
}

interface QuizSubmissionsProps {
  quizId: string
}

export function QuizSubmissions({ quizId }: QuizSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [gradingAnswerId, setGradingAnswerId] = useState<string | null>(null)
  const [gradeScore, setGradeScore] = useState<number>(0)
  const [gradeFeedback, setGradeFeedback] = useState<string>('')

  useEffect(() => {
    fetchSubmissions()
  }, [quizId])

  async function fetchSubmissions() {
    try {
      setLoading(true)
      const response = await fetch(`/api/backoffice/quiz/${quizId}/submissions`)
      const result = await response.json()

      if (result.success) {
        setSubmissions(result.data.submissions)
      } else {
        toast.error(result.error || 'Gagal memuat submissions')
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Terjadi kesalahan saat memuat submissions')
    } finally {
      setLoading(false)
    }
  }

  async function handleGrade(answerId: string, maxPoints: number) {
    try {
      const response = await fetch('/api/backoffice/quiz/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerId,
          score: gradeScore,
          feedback: gradeFeedback,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Jawaban berhasil dinilai')
        setGradingAnswerId(null)
        setGradeScore(0)
        setGradeFeedback('')
        fetchSubmissions() // Refresh data
      } else {
        toast.error(result.error || 'Gagal menilai jawaban')
      }
    } catch (error) {
      console.error('Error grading:', error)
      toast.error('Terjadi kesalahan saat menilai jawaban')
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center">
        <p className="text-sm text-muted-foreground">Belum ada submission</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {submissions.map((submission) => (
        <div key={submission.attemptId} className="rounded-lg border">
          {/* Student header */}
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{submission.student.name}</h3>
                <p className="text-xs text-muted-foreground">{submission.student.email}</p>
              </div>
              <div className="text-right">
                {submission.score !== null && submission.score !== undefined && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={submission.passed ? 'default' : 'destructive'}
                      className="text-sm"
                    >
                      {submission.passed ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {submission.score}%
                    </Badge>
                  </div>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(submission.submittedAt).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="divide-y">
            {submission.answers.map((answer, idx) => (
              <div key={answer.questionId} className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                        {idx + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {answer.questionType === 'MULTIPLE_CHOICE'
                          ? 'Pilihan Ganda'
                          : answer.questionType === 'ESSAY'
                          ? 'Essay'
                          : 'File Upload'}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">{answer.questionText}</p>
                  </div>
                </div>

                {/* Answer content */}
                {answer.questionType === 'FILE_UPLOAD' && answer.uploadedFiles && (
                  <div className="space-y-2">
                    {answer.uploadedFiles.map((file) => {
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
                                {formatFileSize(file.fileSize)} •{' '}
                                {new Date(file.uploadedAt).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.downloadUrl && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="mr-1 h-3 w-3" /> Preview
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <a href={file.downloadUrl} download>
                                    <Download className="mr-1 h-3 w-3" /> Download
                                  </a>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {answer.questionType === 'ESSAY' && (
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <p className="text-sm">{answer.essayText || '(Tidak dijawab)'}</p>
                  </div>
                )}

                {/* Grading section */}
                {(answer.questionType === 'ESSAY' || answer.questionType === 'FILE_UPLOAD') && (
                  <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                    {answer.score !== null && answer.score !== undefined ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Nilai: {answer.score} poin</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setGradingAnswerId(`${submission.attemptId}-${answer.questionId}`)
                              setGradeScore(answer.score ?? 0)
                              setGradeFeedback(answer.feedback || '')
                            }}
                          >
                            Edit Nilai
                          </Button>
                        </div>
                        {answer.feedback && (
                          <p className="text-xs text-muted-foreground">Feedback: {answer.feedback}</p>
                        )}
                      </div>
                    ) : (
                      <Dialog
                        open={gradingAnswerId === `${submission.attemptId}-${answer.questionId}`}
                        onOpenChange={(open) => {
                          if (!open) {
                            setGradingAnswerId(null)
                            setGradeScore(0)
                            setGradeFeedback('')
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setGradingAnswerId(`${submission.attemptId}-${answer.questionId}`)
                              setGradeScore(0)
                              setGradeFeedback('')
                            }}
                          >
                            Beri Nilai
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Beri Nilai</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="score">Nilai (0-10 poin)</Label>
                              <Input
                                id="score"
                                type="number"
                                min={0}
                                max={10}
                                value={gradeScore}
                                onChange={(e) => setGradeScore(Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="feedback">Feedback (Opsional)</Label>
                              <Textarea
                                id="feedback"
                                value={gradeFeedback}
                                onChange={(e) => setGradeFeedback(e.target.value)}
                                placeholder="Berikan feedback untuk jawaban ini..."
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setGradingAnswerId(null)
                                  setGradeScore(0)
                                  setGradeFeedback('')
                                }}
                              >
                                Batal
                              </Button>
                              <Button
                                onClick={() =>
                                  handleGrade(`${submission.attemptId}-${answer.questionId}`, 10)
                                }
                              >
                                Simpan Nilai
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
