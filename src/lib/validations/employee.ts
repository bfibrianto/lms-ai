import { z } from 'zod'

export const employeeSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z
        .string()
        .min(8, 'Password minimal 8 karakter')
        .optional()
        .or(z.literal('')),
    nik: z.string().min(1, 'NIK wajib diisi'),
    position: z.string().min(1, 'Jabatan wajib diisi'),
    department: z.string().optional(),
    joinYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
})

export type EmployeeInput = z.infer<typeof employeeSchema>

export const bulkEmployeeSchema = z.array(employeeSchema)
export type BulkEmployeeInput = z.infer<typeof bulkEmployeeSchema>
