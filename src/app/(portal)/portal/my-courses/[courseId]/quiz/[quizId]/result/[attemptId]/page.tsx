import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { getAttemptResult } from '@/lib/actions/quiz-attempts'
import { QuizResult } from '@/components/portal/quizzes/quiz-result'

interface PageProps {
    params: Promise<{ courseId: string; quizId: string; attemptId: string }>
}

export default async function QuizResultPage({ params }: PageProps) {
    const session = await auth()
    if (!session?.user) redirect('/auth/login')

    const { courseId, quizId, attemptId } = await params

    const result = await getAttemptResult(attemptId)
    if (!result) notFound()

    return <QuizResult result={result} courseId={courseId} />
}
