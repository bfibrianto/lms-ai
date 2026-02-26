import { getCertificateDetail } from '@/lib/actions/certificates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Award } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'

export default async function VerifyCertificatePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const certificateId = params.id
    const certificate = await getCertificateDetail(certificateId)

    if (!certificate) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md text-center shadow-lg">
                    <CardHeader>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <CardTitle className="text-2xl">Sertifikat Tidak Ditemukan</CardTitle>
                        <CardDescription>
                            Sertifikat dengan ID {certificateId} tidak valid atau tidak ditemukan dalam sistem kami.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/" className="text-primary hover:underline font-medium">
                            Kembali ke Beranda
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isRevoked = !certificate.isValid
    const itemName = certificate.course?.title || certificate.path?.title || 'Unknown Program'
    const itemType = certificate.courseId ? 'Kursus' : 'Learning Path'

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl border-t-8 border-t-primary">
                <CardHeader className="text-center pb-2">
                    {isRevoked ? (
                        <div className="mx-auto bg-red-100 text-red-600 p-4 rounded-full mb-4 inline-block">
                            <XCircle className="w-12 h-12" />
                        </div>
                    ) : (
                        <div className="mx-auto bg-green-100 text-green-600 p-4 rounded-full mb-4 inline-block">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                    )}
                    <CardTitle className="text-2xl font-bold">
                        {isRevoked ? 'Sertifikat Dibatalkan' : 'Sertifikat Valid'}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Platform Pembelajaran LMS AI
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    <div className="rounded-lg bg-slate-100 p-6 text-center space-y-4">
                        <Award className="w-10 h-10 text-primary mx-auto" />
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Diberikan Kepada</p>
                            <p className="text-2xl font-bold text-slate-900">{certificate.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                                Atas Kelulusan {itemType}
                            </p>
                            <p className="text-lg font-medium text-slate-800">{itemName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">ID Sertifikat</p>
                            <p className="font-mono font-medium text-slate-900 break-all">{certificate.id}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Tanggal Terbit</p>
                            <p className="font-medium text-slate-900">
                                {format(new Date(certificate.issuedAt), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Status</p>
                            <div className="flex items-center gap-1.5">
                                {isRevoked ? (
                                    <span className="font-medium text-red-600 flex items-center">
                                        <XCircle className="w-4 h-4 mr-1" /> Dibatalkan/Revoked
                                    </span>
                                ) : (
                                    <span className="font-medium text-green-600 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Aktif
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 text-center">
                        <Link href="/" className="text-sm text-primary hover:underline font-medium">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
