'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Route } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { enrollInPath } from '@/lib/actions/path-enrollments'

interface EnrollButtonProps {
    pathId: string
    isEnrolled: boolean
    isCompleted: boolean
}

export function EnrollPathButton({ pathId, isEnrolled, isCompleted }: EnrollButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleEnroll = async () => {
        try {
            setIsLoading(true)
            const res = await enrollInPath(pathId)
            if (!res.success) throw new Error('Pendaftaran jalur pembelajaran gagal')

            toast.success('Berhasil mendaftar ke Learning Path!')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    if (isCompleted) {
        return (
            <Button disabled variant="outline" className="w-full sm:w-auto">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Selesai
            </Button>
        )
    }

    if (isEnrolled) {
        return (
            <Button disabled variant="secondary" className="w-full sm:w-auto">
                <Route className="mr-2 h-4 w-4" />
                Sudah Terdaftar
            </Button>
        )
    }

    return (
        <Button
            onClick={handleEnroll}
            disabled={isLoading}
            className="w-full sm:w-auto"
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && <Route className="mr-2 h-4 w-4" />}
            Daftar Learning Path
        </Button>
    )
}
