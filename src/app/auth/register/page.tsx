'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react'
import { registerCustomer } from '@/lib/actions/auth'
import { toast } from 'sonner'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setFieldErrors({})
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await registerCustomer(formData)

            if (!result.success) {
                if (result.fieldErrors) {
                    setFieldErrors(result.fieldErrors)
                }
                toast.error(result.error || 'Gagal mendaftar')
                setLoading(false)
                return
            }

            // Auto-login after successful registration
            const signInResult = await signIn('credentials', {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                redirect: false,
            })

            if (signInResult?.error) {
                // Registration succeeded but login failed — redirect to login
                toast.success('Akun berhasil dibuat! Silakan masuk.')
                router.push('/auth/login')
            } else {
                toast.success('Selamat datang! Akun Anda berhasil dibuat.')
                router.push('/portal/dashboard')
                router.refresh()
            }
        } catch {
            toast.error('Terjadi kesalahan. Silakan coba lagi.')
            setLoading(false)
        }
    }

    return (
        <div className="flex w-full items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Sitamoto Academy</CardTitle>
                    <CardDescription>
                        Buat Akun Baru
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nama lengkap Anda"
                                required
                                autoComplete="name"
                                disabled={loading}
                            />
                            {fieldErrors.name && (
                                <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@contoh.com"
                                required
                                autoComplete="email"
                                disabled={loading}
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Minimal 8 karakter"
                                    required
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {fieldErrors.password ? (
                                <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Min. 8 karakter, harus mengandung huruf dan angka
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Ketik ulang password"
                                    required
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="text-xs text-destructive">{fieldErrors.confirmPassword[0]}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                'Daftar Sekarang'
                            )}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Sudah punya akun?{' '}
                        <Link href="/auth/login" className="font-medium text-primary hover:underline">
                            Masuk
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
