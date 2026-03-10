'use client'

import { useState } from 'react'
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
import { Mail, ArrowLeft } from 'lucide-react'
import { requestPasswordReset } from '@/lib/actions/auth/reset'

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await requestPasswordReset(formData)

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || 'Terjadi kesalahan')
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
                        <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Lupa Password?</CardTitle>
                    <CardDescription>
                        Masukkan email Anda untuk menerima tautan pemulihan kata sandi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nama@perusahaan.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Mengirim...' : 'Kirim Tautan'}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                            <p className="text-sm text-green-800 dark:text-green-300">
                                <b>Tautan terkirim!</b> Silakan periksa kotak masuk (atau spam) email Anda untuk langkah selanjutnya.
                            </p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/auth/login">Kembali ke halaman login</Link>
                            </Button>
                        </div>
                    )}

                    {!success && (
                        <div className="mt-4 text-center">
                            <Link href="/auth/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke login
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
