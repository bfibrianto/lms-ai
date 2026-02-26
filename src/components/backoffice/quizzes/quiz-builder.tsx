'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Trash2,
    Pencil,
    CheckCircle2,
    HelpCircle,
    FileText,
    Timer,
    Settings,
    Sparkles,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { QuizSettingsForm } from './quiz-settings-form'
import { QuestionEditor } from './question-editor'
import { deleteQuiz, deleteQuestion } from '@/lib/actions/quizzes'
import { GenerateQuizModal } from './generate-quiz-modal'
import type { QuizDetail } from '@/types/quizzes'

interface QuizBuilderProps {
    courseId: string
    quizzes: QuizDetail[]
    canEdit: boolean
}

export function QuizBuilder({ courseId, quizzes, canEdit }: QuizBuilderProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [editingQuiz, setEditingQuiz] = useState<QuizDetail | null>(null)
    const [addingQuestionQuizId, setAddingQuestionQuizId] = useState<string | null>(null)
    const [generatingQuizId, setGeneratingQuizId] = useState<string | null>(null)
    const [editingQuestion, setEditingQuestion] = useState<{
        quizId: string
        question: QuizDetail['questions'][0]
    } | null>(null)
    const [isPending, startTransition] = useTransition()

    function handleDeleteQuiz(quizId: string) {
        startTransition(async () => {
            const result = await deleteQuiz(quizId)
            if (result.success) {
                toast.success('Quiz berhasil dihapus')
            } else {
                toast.error(result.error ?? 'Gagal menghapus quiz')
            }
        })
    }

    function handleDeleteQuestion(questionId: string) {
        startTransition(async () => {
            const result = await deleteQuestion(questionId)
            if (result.success) {
                toast.success('Soal berhasil dihapus')
            } else {
                toast.error(result.error ?? 'Gagal menghapus soal')
            }
        })
    }

    return (
        <div className="space-y-4">
            {quizzes.length === 0 && (
                <div className="rounded-lg border border-dashed py-10 text-center">
                    <HelpCircle className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                        Belum ada quiz. Tambahkan quiz untuk menguji pemahaman peserta.
                    </p>
                </div>
            )}

            {quizzes.map((quiz) => (
                <div key={quiz.id} className="rounded-lg border">
                    {/* Quiz header */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{quiz.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {quiz.questions.length} soal
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Passing: {quiz.passingScore}%
                                </span>
                                {quiz.duration && (
                                    <span className="flex items-center gap-1">
                                        <Timer className="h-3 w-3" />
                                        {quiz.duration} menit
                                    </span>
                                )}
                                <span>Maks {quiz.maxAttempts}x percobaan</span>
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex items-center gap-1">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingQuiz(quiz)}
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Pengaturan Quiz</DialogTitle>
                                        </DialogHeader>
                                        <QuizSettingsForm
                                            courseId={courseId}
                                            quiz={quiz}
                                            onSuccess={() => setEditingQuiz(null)}
                                            onCancel={() => setEditingQuiz(null)}
                                        />
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Quiz?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Semua soal dan data percobaan akan dihapus permanen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteQuiz(quiz.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>

                    {/* Questions list */}
                    <div className="divide-y">
                        {quiz.questions.map((question, qIdx) => (
                            <div
                                key={question.id}
                                className="flex items-start justify-between px-4 py-3"
                            >
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                                            {qIdx + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm">{question.text}</p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="secondary" className="text-xs">
                                                    {question.type === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Essay'}
                                                </Badge>
                                                <span>{question.points} poin</span>
                                                {question.type === 'MULTIPLE_CHOICE' && (
                                                    <span>{question.options.length} opsi</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {canEdit && (
                                    <div className="ml-2 flex shrink-0 items-center gap-1">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => setEditingQuestion({ quizId: quiz.id, question })}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Soal</DialogTitle>
                                                </DialogHeader>
                                                <QuestionEditor
                                                    quizId={quiz.id}
                                                    question={question}
                                                    onSuccess={() => setEditingQuestion(null)}
                                                    onCancel={() => setEditingQuestion(null)}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Hapus Soal?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Soal ini akan dihapus permanen.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        ))}

                        {quiz.questions.length === 0 && (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                Belum ada soal
                            </div>
                        )}
                    </div>

                    {/* Add question */}
                    {canEdit && (
                        <div className="border-t p-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Dialog open={addingQuestionQuizId === quiz.id} onOpenChange={(open) => setAddingQuestionQuizId(open ? quiz.id : null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full border-dashed flex-1">
                                            <Plus className="mr-1 h-3 w-3" /> Tambah Soal
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>Tambah Soal</DialogTitle>
                                        </DialogHeader>
                                        <QuestionEditor
                                            quizId={quiz.id}
                                            onSuccess={() => setAddingQuestionQuizId(null)}
                                            onCancel={() => setAddingQuestionQuizId(null)}
                                        />
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full flex-1"
                                    onClick={() => setGeneratingQuizId(quiz.id)}
                                >
                                    <Sparkles className="mr-1 h-3 w-3 text-primary" /> Generate Soal AI
                                </Button>
                            </div>

                            <GenerateQuizModal
                                quizId={quiz.id}
                                isOpen={generatingQuizId === quiz.id}
                                onOpenChange={(open) => setGeneratingQuizId(open ? quiz.id : null)}
                                onSuccess={() => setGeneratingQuizId(null)}
                            />
                        </div>
                    )}
                </div>
            ))}

            {/* Create quiz */}
            {
                canEdit && (
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-dashed">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Quiz
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Buat Quiz Baru</DialogTitle>
                            </DialogHeader>
                            <QuizSettingsForm
                                courseId={courseId}
                                onSuccess={() => setShowCreateDialog(false)}
                                onCancel={() => setShowCreateDialog(false)}
                            />
                        </DialogContent>
                    </Dialog>
                )
            }
        </div >
    )
}
