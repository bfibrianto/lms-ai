'use server'

import { db } from '@/lib/db'
import { employeeSchema, bulkEmployeeSchema } from '@/lib/validations/employee'
import type { EmployeeInput, BulkEmployeeInput } from '@/lib/validations/employee'
import bcrypt from 'bcryptjs'
import { Role } from '@/generated/prisma/client'

export async function createEmployee(data: EmployeeInput) {
    try {
        const parsed = employeeSchema.safeParse(data)
        if (!parsed.success) {
            return { success: false, error: 'Validasi gagal', details: parsed.error.format() }
        }

        const { email, nik, password, ...rest } = parsed.data

        // Check existing email & nik
        const existingEmail = await db.user.findUnique({ where: { email } })
        if (existingEmail) return { success: false, error: 'Email sudah terdaftar' }

        if (nik) {
            const existingNik = await db.user.findUnique({ where: { nik } })
            if (existingNik) return { success: false, error: 'NIK sudah terdaftar' }
        }

        // Hash password (default to NIK if not provided)
        const rawPassword = password || nik || 'password123'
        const hashedPassword = await bcrypt.hash(rawPassword, 10)

        const user = await db.user.create({
            data: {
                email,
                nik,
                password: hashedPassword,
                role: Role.EMPLOYEE,
                ...rest,
            },
            select: { id: true, name: true, email: true, nik: true, position: true, department: true, joinYear: true, isActive: true, createdAt: true },
        })

        return { success: true, data: user }
    } catch (error: any) {
        console.error('Failed to create employee:', error)
        return { success: false, error: 'Terjadi kesalahan sistem' }
    }
}

export async function updateEmployee(id: string, data: EmployeeInput) {
    try {
        const parsed = employeeSchema.safeParse(data)
        if (!parsed.success) {
            return { success: false, error: 'Validasi gagal', details: parsed.error.format() }
        }

        const { email, nik, password, ...rest } = parsed.data

        // Check email uniqueness if changed
        const existingUserByEmail = await db.user.findUnique({ where: { email } })
        if (existingUserByEmail && existingUserByEmail.id !== id) {
            return { success: false, error: 'Email sudah digunakan karyawan lain' }
        }

        // Check NIK uniqueness if changed
        if (nik) {
            const existingUserByNik = await db.user.findUnique({ where: { nik } })
            if (existingUserByNik && existingUserByNik.id !== id) {
                return { success: false, error: 'NIK sudah digunakan karyawan lain' }
            }
        }

        const updateData: any = {
            email,
            nik,
            ...rest
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updated = await db.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, nik: true, position: true, department: true, joinYear: true, isActive: true, createdAt: true },
        })

        return { success: true, data: updated }

    } catch (error: any) {
        console.error('Failed to update employee:', error)
        return { success: false, error: 'Terjadi kesalahan saat update' }
    }
}

export async function bulkCreateEmployees(data: BulkEmployeeInput) {
    try {
        const parsed = bulkEmployeeSchema.safeParse(data)
        if (!parsed.success) {
            return { success: false, error: 'Validasi baris gagal', details: parsed.error.format() }
        }

        // Collect emails & NIKs to check uniqueness upfront to prevent partial failures
        const emails = parsed.data.map((e) => e.email)
        const niks = parsed.data.map((e) => e.nik).filter((n) => n) as string[]

        const existingUsers = await db.user.findMany({
            where: {
                OR: [{ email: { in: emails } }, { nik: { in: niks } }],
            },
            select: { email: true, nik: true },
        })

        if (existingUsers.length > 0) {
            const dupeEmails = existingUsers.map((u) => u.email).filter((e) => emails.includes(e))
            const dupeNiks = existingUsers.map((u) => u.nik).filter((n) => n && niks.includes(n))
            return {
                success: false,
                error: 'Terdapat Email atau NIK yang sudah terdaftar dalam sistem',
                details: { dupeEmails, dupeNiks }
            }
        }

        // Hash all passwords
        const employeesToCreate = await Promise.all(
            parsed.data.map(async (emp) => {
                const passwordToHash = emp.password || emp.nik || 'password123'
                const hashedPassword = await bcrypt.hash(passwordToHash, 10)
                return {
                    email: emp.email,
                    name: emp.name,
                    nik: emp.nik,
                    position: emp.position,
                    department: emp.department,
                    joinYear: emp.joinYear,
                    role: Role.EMPLOYEE,
                    password: hashedPassword,
                }
            })
        )

        const result = await db.user.createMany({
            data: employeesToCreate,
            skipDuplicates: true, // Fail-safe
        })

        return { success: true, count: result.count }
    } catch (error: any) {
        console.error('Failed to bulk create employees:', error)
        return { success: false, error: 'Terjadi kesalahan sistem' }
    }
}

export async function getEmployees() {
    try {
        const users = await db.user.findMany({
            where: { role: Role.EMPLOYEE },
            select: {
                id: true,
                name: true,
                email: true,
                nik: true,
                position: true,
                department: true,
                joinYear: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, data: users }
    } catch (error: any) {
        return { success: false, error: 'Gagal mengambil data karyawan' }
    }
}
