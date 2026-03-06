import { Metadata } from 'next'
import { getEmployees } from '@/lib/actions/employees'
import { EmployeeList } from './employee-list'

export const metadata: Metadata = {
    title: 'Manajemen Karyawan',
    description: 'Kelola data karyawan.',
}

export default async function EmployeesPage() {
    const result = await getEmployees()
    const employees = result.success && result.data ? result.data : []

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Manajemen Karyawan</h2>
            </div>

            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <EmployeeList initialEmployees={employees} />
            </div>
        </div>
    )
}
