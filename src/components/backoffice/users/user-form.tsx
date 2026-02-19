'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateUserSchema, EditUserSchema } from '@/lib/validations/users'
import { createUser, updateUser } from '@/lib/actions/users'
import { roleLabels } from '@/lib/roles'
import type { UserDetail } from '@/types/users'

type CreateValues = z.infer<typeof CreateUserSchema>
type EditValues = z.infer<typeof EditUserSchema>

interface UserFormProps {
  mode: 'create'
  currentUserRole?: string
}

interface UserFormEditProps {
  mode: 'edit'
  user: UserDetail
  currentUserRole?: string
}

type Props = UserFormProps | UserFormEditProps

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: roleLabels.SUPER_ADMIN },
  { value: 'HR_ADMIN', label: roleLabels.HR_ADMIN },
  { value: 'MENTOR', label: roleLabels.MENTOR },
  { value: 'LEADER', label: roleLabels.LEADER },
  { value: 'EMPLOYEE', label: roleLabels.EMPLOYEE },
]

export function UserForm(props: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isEdit = props.mode === 'edit'
  const user = isEdit ? props.user : undefined

  // Filter out SUPER_ADMIN option for HR_ADMIN
  const roleOptions =
    props.currentUserRole === 'HR_ADMIN'
      ? ROLE_OPTIONS.filter((r) => r.value !== 'SUPER_ADMIN')
      : ROLE_OPTIONS

  // Use the appropriate schema based on mode
  const schema = isEdit ? EditUserSchema : CreateUserSchema

  const form = useForm<CreateValues | EditValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          name: user!.name,
          email: user!.email,
          password: '',
          role: user!.role,
          department: user!.department ?? '',
          position: user!.position ?? '',
          isActive: user!.isActive,
        }
      : {
          name: '',
          email: '',
          password: '',
          role: 'EMPLOYEE' as const,
          department: '',
          position: '',
          isActive: true,
        },
  })

  function onSubmit(values: CreateValues | EditValues) {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      formData.append(k, String(v ?? ''))
    })

    startTransition(async () => {
      try {
        const result = isEdit
          ? await updateUser(user!.id, formData)
          : await createUser(formData)

        if (result.success) {
          toast.success(
            isEdit
              ? 'Pengguna berhasil diperbarui'
              : 'Pengguna berhasil ditambahkan'
          )
          router.push('/backoffice/users')
          router.refresh()
        } else {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              form.setError(field as keyof (CreateValues | EditValues), {
                message: errors[0],
              })
            })
          }
          toast.error(result.error)
        }
      } catch {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Nama */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Budi Santoso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contoh@perusahaan.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password{isEdit && <span className="text-muted-foreground"> (opsional)</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={isEdit ? '••••••••' : 'Min. 8 karakter'}
                    {...field}
                  />
                </FormControl>
                {isEdit && (
                  <FormDescription>
                    Kosongkan jika tidak ingin mengubah password
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departemen */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departemen</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Engineering"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jabatan */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Software Engineer"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status Aktif */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 rounded-lg border p-4">
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <FormLabel className="text-sm font-medium">
                  Status Aktif
                </FormLabel>
                <FormDescription className="text-xs">
                  Pengguna nonaktif tidak dapat login ke sistem
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEdit
                ? 'Menyimpan...'
                : 'Menambahkan...'
              : isEdit
                ? 'Simpan Perubahan'
                : 'Tambah Pengguna'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/backoffice/users')}
            disabled={isPending}
          >
            Batal
          </Button>
        </div>
      </form>
    </Form>
  )
}
