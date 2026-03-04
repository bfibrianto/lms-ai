'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { UpdateProfileSchema, ChangePasswordSchema } from '@/lib/validations/account'
import { updateProfile, changePassword } from '@/lib/actions/account'
import { roleLabels } from '@/lib/roles'

type ProfileFormValues = z.infer<typeof UpdateProfileSchema>
type PasswordFormValues = z.infer<typeof ChangePasswordSchema>

interface UserProfile {
    id: string
    name: string
    email: string
    role: string
    department: string | null
    position: string | null
    avatar: string | null
    createdAt: Date
}

interface AccountSettingsFormProps {
    profile: UserProfile
}

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
                <p className="text-muted-foreground">
                    Kelola informasi profil dan keamanan akun Anda
                </p>
            </div>

            <ProfileCard profile={profile} />
            <ChangePasswordCard />
        </div>
    )
}

function ProfileCard({ profile }: { profile: UserProfile }) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: profile.name,
        },
    })

    function onSubmit(values: ProfileFormValues) {
        startTransition(async () => {
            const result = await updateProfile(values)
            if (result.success) {
                toast.success('Profil berhasil diperbarui')
            } else {
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, errors]) => {
                        form.setError(field as keyof ProfileFormValues, { message: errors[0] })
                    })
                }
                toast.error(result.error || 'Gagal memperbarui profil')
            }
        })
    }

    const joinedDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(profile.createdAt))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>Detail akun dan nama tampilan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Read-only fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm">{profile.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                        <Badge variant="secondary">
                            {roleLabels[profile.role] || profile.role}
                        </Badge>
                    </div>
                    {profile.department && (
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Departemen</p>
                            <p className="text-sm">{profile.department}</p>
                        </div>
                    )}
                    {profile.position && (
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Jabatan</p>
                            <p className="text-sm">{profile.position}</p>
                        </div>
                    )}
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Bergabung</p>
                        <p className="text-sm">{joinedDate}</p>
                    </div>
                </div>

                {/* Editable name */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2 border-t">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Tampilan</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan nama tampilan" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nama ini akan ditampilkan di seluruh platform
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

function ChangePasswordCard() {
    const [isPending, startTransition] = useTransition()
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    function onSubmit(values: PasswordFormValues) {
        startTransition(async () => {
            const result = await changePassword(values)
            if (result.success) {
                toast.success('Password berhasil diubah')
                form.reset()
                setShowCurrent(false)
                setShowNew(false)
                setShowConfirm(false)
            } else {
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, errors]) => {
                        form.setError(field as keyof PasswordFormValues, { message: errors[0] })
                    })
                }
                toast.error(result.error || 'Gagal mengubah password')
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ganti Password</CardTitle>
                <CardDescription>
                    Pastikan akun Anda menggunakan password yang kuat
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Lama</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showCurrent ? 'text' : 'password'}
                                                placeholder="Masukkan password lama"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                            >
                                                {showCurrent ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showNew ? 'text' : 'password'}
                                                placeholder="Masukkan password baru"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() => setShowNew(!showNew)}
                                            >
                                                {showNew ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Min. 8 karakter, harus mengandung huruf dan angka
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Konfirmasi Password Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirm ? 'text' : 'password'}
                                                placeholder="Ulangi password baru"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                            >
                                                {showConfirm ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ganti Password
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
