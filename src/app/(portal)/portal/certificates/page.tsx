import { getMyCertificates } from '@/lib/actions/certificates'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, Download, DownloadIcon, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default async function PortalCertificatesPage() {
    const certificates = await getMyCertificates()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sertifikat Saya</h1>
                <p className="text-muted-foreground mt-2">
                    Daftar sertifikat kelulusan dari kursus dan learning path yang telah Anda selesaikan.
                </p>
            </div>

            {certificates.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted p-4">
                            <Award className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Belum Ada Sertifikat</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Anda belum mendapatkan sertifikat. Selesaikan kursus atau learning path untuk mendapatkan sertifikat kelulusan.
                            </p>
                        </div>
                        <Button asChild className="mt-4">
                            <Link href="/portal/courses">Cari Kursus</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert) => {
                        const itemTitle = cert.course?.title || cert.path?.title || 'Unknown Program'
                        const itemType = cert.courseId ? 'Kursus' : 'Learning Path'
                        // Just a placeholder thumbnail if none exists
                        const thumbnail = cert.course?.thumbnail || cert.path?.thumbnail || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop'

                        return (
                            <Card key={cert.id} className="overflow-hidden flex flex-col">
                                <div className="aspect-video relative bg-slate-100">
                                    <Image
                                        src={thumbnail}
                                        alt={itemTitle}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3 flex items-start gap-2">
                                        <Award className="h-6 w-6 text-yellow-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-white/80">{itemType}</p>
                                            <p className="text-sm font-semibold text-white line-clamp-2">{itemTitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4 flex-1">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>
                                                Terbit: {format(new Date(cert.issuedAt), 'dd MMMM yyyy', { locale: id })}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">ID Sertifikat</p>
                                            <p className="text-sm font-mono bg-muted p-1.5 rounded-md inline-block">
                                                {cert.id}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 gap-2">
                                    <Button asChild variant="default" className="w-full">
                                        <a href={`/api/certificates/${cert.id}/download`} target="_blank" rel="noopener noreferrer">
                                            <DownloadIcon className="h-4 w-4 mr-2" />
                                            Download PDF
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" size="icon" title="Verifikasi">
                                        <Link href={`/verify/${cert.id}`}>
                                            <Award className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
