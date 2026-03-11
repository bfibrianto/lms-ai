'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { KeyRound, ArrowRight } from 'lucide-react'
import { resetPassword } from '@/lib/actions/auth/reset'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    if (!token) {
        return (
            <div className="flex w-full items-center justify-center px-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Token Tidak Valid</AlertTitle>
                    <AlertDescription>
                        Tautan reset password ini tidak valid atau formatnya salah. Harap ajukan <Link className="underline font-medium" href="/auth/forgot-password">permintaan baru</Link>.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setFieldErrors({})
        setSuccess(false)
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await resetPassword(formData, token as string)

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || 'Terjadi kesalahan')
                if (result.fieldErrors) {
                    setFieldErrors(result.fieldErrors)
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan yang tidak terduga')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex w-full items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <KeyRound className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Buat Kata Sandi Baru</CardTitle>
                    <CardDescription>
                        Tentukan kata sandi baru untuk akun Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                {fieldErrors.password && (
                                    <p className="text-sm text-destructive">{fieldErrors.password[0]}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Ketik ulang password baru"
                                    required
                                />
                                {fieldErrors.confirmPassword && (
                                    <p className="text-sm text-destructive">{fieldErrors.confirmPassword[0]}</p>
                                )}
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="ml-2">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4 rounded-md bg-green-50 p-4 dark:bg-green-900/20 text-center">
                            <p className="text-sm text-green-800 dark:text-green-300">
                                <b>Berhasil!</b> Kata sandi Anda telah diperbarui.
                            </p>
                            <Button className="w-full" asChild>
                                <Link href="/auth/login">
                                    Masuk Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex w-full items-center justify-center p-8">Memuat...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
