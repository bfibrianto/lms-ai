'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Upload, Download, Loader2, MoreVertical, Edit, Eye } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

import { createEmployee, bulkCreateEmployees, updateEmployee } from '@/lib/actions/employees'
import type { EmployeeInput } from '@/lib/validations/employee'

interface EmployeeData {
    id: string
    name: string
    email: string
    nik: string | null
    position: string | null
    department: string | null
    joinYear: number | null
    isActive: boolean
    createdAt: Date
}

interface EmployeeListProps {
    initialEmployees: EmployeeData[]
}

export function EmployeeList({ initialEmployees }: EmployeeListProps) {
    const router = useRouter()

    // Sync external props to state (useful if router.refresh() pushes new props)
    const [employees, setEmployees] = useState<EmployeeData[]>(initialEmployees)
    useEffect(() => {
        setEmployees(initialEmployees)
    }, [initialEmployees])

    const [searchQuery, setSearchQuery] = useState('')

    // Single Add/Edit State
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [viewMode, setViewMode] = useState(false)
    const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null)
    const [formData, setFormData] = useState<EmployeeInput>({
        name: '',
        email: '',
        password: '',
        nik: '',
        position: '',
        department: '',
        joinYear: new Date().getFullYear(),
    })

    // Bulk Import State
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (emp.nik && emp.nik.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            nik: '',
            position: '',
            department: '',
            joinYear: new Date().getFullYear(),
        })
        setEditMode(false)
        setViewMode(false)
        setCurrentEmployeeId(null)
    }

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsAdding(true)

        try {
            if (editMode && currentEmployeeId) {
                const result = await updateEmployee(currentEmployeeId, formData)
                if (!result.success) {
                    toast.error(result.error)
                    return
                }
                toast.success('Data Karyawan berhasil diperbarui')
                // Optimistic Update
                setEmployees(prev => prev.map(emp => emp.id === currentEmployeeId ? { ...emp, ...result.data } : emp))
            } else {
                const result = await createEmployee(formData)
                if (!result.success) {
                    toast.error(result.error)
                    return
                }
                toast.success('Karyawan berhasil ditambahkan')
                // Optimistic Update
                if (result.data) {
                    setEmployees(prev => [result.data as EmployeeData, ...prev])
                }
            }

            setIsAddOpen(false)
            resetForm()
            router.refresh()
        } catch (error) {
            toast.error('Terjadi kesalahan sistem')
        } finally {
            setIsAdding(false)
        }
    }

    const openEditModal = (emp: EmployeeData) => {
        setEditMode(true)
        setViewMode(false)
        setCurrentEmployeeId(emp.id)
        setFormData({
            name: emp.name,
            email: emp.email,
            password: '',
            nik: emp.nik || '',
            position: emp.position || '',
            department: emp.department || '',
            joinYear: emp.joinYear || new Date().getFullYear(),
        })
        setIsAddOpen(true)
    }

    const openViewModal = (emp: EmployeeData) => {
        setViewMode(true)
        setEditMode(false)
        setCurrentEmployeeId(emp.id)
        setFormData({
            name: emp.name,
            email: emp.email,
            password: '',
            nik: emp.nik || '',
            position: emp.position || '',
            department: emp.department || '',
            joinYear: emp.joinYear || new Date().getFullYear(),
        })
        setIsAddOpen(true)
    }

    const handleImportSubmit = async () => {
        if (!file) {
            toast.error('Pilih file Excel/CSV terlebih dahulu')
            return
        }

        setIsImporting(true)
        try {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]
                    const jsonData = XLSX.utils.sheet_to_json(worksheet)

                    // Map and validate JSON rows to match BulkEmployeeInput
                    const payload = jsonData.map((row: any) => ({
                        name: String(row['Name'] || row['Nama'] || ''),
                        email: String(row['Email'] || ''),
                        nik: String(row['NIK'] || ''),
                        position: String(row['Position'] || row['Jabatan'] || ''),
                        department: String(row['Department'] || row['Departemen'] || ''),
                        joinYear: Number(row['Join Year'] || row['Tahun Bergabung'] || new Date().getFullYear()),
                        password: row['Password'] ? String(row['Password']) : '',
                    }))

                    const result = await bulkCreateEmployees(payload)
                    if (!result.success) {
                        toast.error(result.error)
                        return
                    }

                    toast.success(`Berhasil mengimpor ${result.count} karyawan!`)
                    setIsImportOpen(false)
                    setFile(null)
                    router.refresh()
                } catch (err) {
                    console.error(err)
                    toast.error('Gagal memproses file Excel. Pastikan format sesuai.')
                } finally {
                    setIsImporting(false)
                }
            }
            reader.readAsArrayBuffer(file)
        } catch (error) {
            toast.error('Terjadi kesalahan saat memproses file')
            setIsImporting(false)
        }
    }

    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            {
                'Nama': 'Budi Santoso',
                'Email': 'budi@example.com',
                'NIK': 'EMP-001',
                'Jabatan': 'Staff Marketing',
                'Departemen': 'Marketing',
                'Tahun Bergabung': 2023,
            },
        ])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Template Karyawan')
        XLSX.writeFile(wb, 'Template_Import_Karyawan.xlsx')
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Cari nama, email, atau NIK..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    <Button onClick={() => { resetForm(); setIsAddOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Karyawan
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>NIK</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Departemen</TableHead>
                            <TableHead>Tahun Join</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Tidak ada data karyawan ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.nik || '-'}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell>{emp.position}</TableCell>
                                    <TableCell>{emp.department || '-'}</TableCell>
                                    <TableCell>{emp.joinYear}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openViewModal(emp)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditModal(emp)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit/View Single Modal */}
            <Dialog open={isAddOpen} onOpenChange={(open) => {
                if (!open) {
                    resetForm()
                }
                setIsAddOpen(open)
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {viewMode ? 'Detail Karyawan' : editMode ? 'Edit Karyawan' : 'Tambah Karyawan'}
                        </DialogTitle>
                        <DialogDescription>
                            {viewMode ? 'Detail informasi karyawan.' : editMode ? 'Perbarui data karyawan.' : 'Tambahkan data karyawan baru ke dalam sistem. Password default adalah NIK.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK *</Label>
                                <Input
                                    id="nik"
                                    required
                                    disabled={viewMode}
                                    value={formData.nik}
                                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="joinYear">Tahun Bergabung *</Label>
                                <Input
                                    id="joinYear"
                                    type="number"
                                    required
                                    disabled={viewMode}
                                    value={formData.joinYear}
                                    onChange={(e) => setFormData({ ...formData, joinYear: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                                id="name"
                                required
                                disabled={viewMode}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                disabled={viewMode}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        {!viewMode && (
                            <div className="space-y-2">
                                <Label htmlFor="password">{editMode ? 'Password Baru (Opsional)' : 'Password (Opsional)'}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={editMode ? 'Biarkan kosong jika tidak diubah' : 'Default: NIK'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">Jabatan *</Label>
                                <Input
                                    id="position"
                                    required
                                    disabled={viewMode}
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Departemen</Label>
                                <Input
                                    id="department"
                                    disabled={viewMode}
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                {viewMode ? 'Tutup' : 'Batal'}
                            </Button>
                            {!viewMode && (
                                <Button type="submit" disabled={isAdding}>
                                    {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Bulk Import Modal */}
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Import Data Karyawan</DialogTitle>
                        <DialogDescription>
                            Unggah file Excel (.xlsx) atau CSV yang berisi daftar karyawan. Sistem otomatis akan membuatkan akun untuk setiap baris data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                            <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                            <Input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="max-w-[250px]"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Hanya menerima file .xlsx, .xls, .csv
                            </p>
                        </div>

                        <div className="flex flex-col space-y-2 rounded-md bg-muted p-4 text-sm">
                            <p className="font-semibold">Butuh template?</p>
                            <p className="text-muted-foreground">
                                Unduh template excel yang sudah diformat dengan benar untuk memastikan data dapat diimpor dengan lancar.
                            </p>
                            <Button variant="link" className="h-auto p-0 justify-start" onClick={downloadTemplate}>
                                <Download className="mr-2 h-4 w-4" />
                                Unduh Template .xlsx
                            </Button>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsImportOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleImportSubmit} disabled={isImporting || !file}>
                            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Import Data
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
