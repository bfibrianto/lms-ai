'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Eye, EyeOff, Loader2, User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, changePassword } from '@/lib/actions/account'
import { roleLabels } from '@/lib/roles'

interface AccountSettingsFormProps {
    user: {
        id: string
        name: string | null
        email: string
        role: string
        department: string | null
        position: string | null
        avatar: string | null
        createdAt: Date
    }
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
    const router = useRouter()
    const [profilePending, startProfileTransition] = useTransition()
    const [passwordPending, startPasswordTransition] = useTransition()

    // Profile state
    const [name, setName] = useState(user.name || '')
    const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({})

    // Password state
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({})

    function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setProfileErrors({})

        const formData = new FormData(e.currentTarget)

        startProfileTransition(async () => {
            const result = await updateProfile(formData)
            if (result.success) {
                toast.success('Profil berhasil diperbarui')
                router.refresh()
            } else {
                if (result.fieldErrors) setProfileErrors(result.fieldErrors)
                toast.error(result.error || 'Gagal memperbarui profil')
            }
        })
    }

    function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setPasswordErrors({})

        const formData = new FormData(e.currentTarget)

        startPasswordTransition(async () => {
            const result = await changePassword(formData)
            if (result.success) {
                toast.success('Password berhasil diubah')
                    ; (e.target as HTMLFormElement).reset()
            } else {
                if (result.fieldErrors) setPasswordErrors(result.fieldErrors)
                toast.error(result.error || 'Gagal mengubah password')
            }
        })
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informasi Profil
                    </CardTitle>
                    <CardDescription>
                        Kelola informasi tampilan akun Anda
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                    <CardContent className="space-y-4">
                        {/* Read-only info */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">Email</Label>
                                <p className="text-sm font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">Role</Label>
                                <div>
                                    <Badge variant="secondary">
                                        {roleLabels[user.role] || user.role}
                                    </Badge>
                                </div>
                            </div>
                            {user.department && (
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Department</Label>
                                    <p className="text-sm font-medium">{user.department}</p>
                                </div>
                            )}
                            {user.position && (
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Posisi</Label>
                                    <p className="text-sm font-medium">{user.position}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">Bergabung Sejak</Label>
                                <p className="text-sm font-medium">
                                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Editable name */}
                        <div className="space-y-2 pt-2 border-t">
                            <Label htmlFor="name">Nama Tampilan</Label>
                            <Input
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama tampilan Anda"
                                disabled={profilePending}
                            />
                            {profileErrors.name && (
                                <p className="text-xs text-destructive">{profileErrors.name[0]}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={profilePending}>
                            {profilePending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Ganti Password
                    </CardTitle>
                    <CardDescription>
                        Perbarui password Anda untuk keamanan akun
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit}>
                    <CardContent className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Password Lama</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrent ? 'text' : 'password'}
                                    placeholder="Masukkan password lama"
                                    autoComplete="current-password"
                                    disabled={passwordPending}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordErrors.currentPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.currentPassword[0]}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="Minimal 8 karakter"
                                    autoComplete="new-password"
                                    disabled={passwordPending}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordErrors.newPassword ? (
                                <p className="text-xs text-destructive">{passwordErrors.newPassword[0]}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Min. 8 karakter, harus mengandung huruf dan angka
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Ketik ulang password baru"
                                    autoComplete="new-password"
                                    disabled={passwordPending}
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
                            {passwordErrors.confirmPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.confirmPassword[0]}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={passwordPending}>
                            {passwordPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengubah...
                                </>
                            ) : (
                                'Ganti Password'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
