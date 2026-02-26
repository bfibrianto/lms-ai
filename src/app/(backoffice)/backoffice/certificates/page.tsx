import { getAllCertificates } from '@/lib/actions/certificates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { DownloadIcon, EyeIcon } from 'lucide-react'
import Link from 'next/link'

export default async function BackofficeCertificatesPage() {
    const certificates = await getAllCertificates()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manajemen Sertifikat</h1>
                <p className="text-muted-foreground mt-2">
                    Kelola dan pantau seluruh sertifikat yang telah diterbitkan sistem.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Sertifikat Terbit</CardTitle>
                    <CardDescription>
                        Menampilkan {certificates.length} sertifikat terbaru
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Sertifikat</TableHead>
                                <TableHead>Penerima</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Tanggal Terbit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Belum ada sertifikat yang diterbitkan.
                                    </TableCell>
                                </TableRow>
                            ) : certificates.map((cert) => {
                                const itemName = cert.course?.title || cert.path?.title || 'Unknown'
                                const itemType = cert.courseId ? 'Kursus' : 'Path'

                                return (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-mono text-xs">{cert.id.substring(0, 15)}...</TableCell>
                                        <TableCell>
                                            <p className="font-medium">{cert.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{cert.user.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{itemName}</span>
                                                <span className="text-xs text-muted-foreground">{itemType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(cert.issuedAt), 'dd MMM yyyy', { locale: id })}
                                        </TableCell>
                                        <TableCell>
                                            {cert.isValid ? (
                                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Valid</Badge>
                                            ) : (
                                                <Badge variant="destructive">Dibatalkan</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" asChild title="Buka Halaman Verifikasi">
                                                    <Link href={`/verify/${cert.id}`} target="_blank">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="icon" asChild title="Download PDF">
                                                    <a href={`/api/certificates/${cert.id}/download`} target="_blank">
                                                        <DownloadIcon className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
