import { getCoursePreviewContent } from '@/lib/actions/courses'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils/format-currency'
import {
    ArrowLeft,
    Lock,
    CheckCircle2,
    GraduationCap,
    FileText,
    Video,
    HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'

function getLessonIcon(type: string) {
    switch (type) {
        case 'VIDEO':
            return <Video className="h-5 w-5 text-primary" />
        case 'QUIZ':
            return <HelpCircle className="h-5 w-5 text-primary" />
        default:
            return <FileText className="h-5 w-5 text-primary" />
    }
}

export default async function CoursePreviewPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getCoursePreviewContent(id)

    if (!data || !data.previewModule) notFound()

    const effectivePrice = data.promoPrice ?? data.price ?? 0
    const isFree = effectivePrice === 0

    return (
        <div className="min-h-screen bg-background">
            {/* Top Nav */}
            <div className="border-b">
                <div className="container mx-auto max-w-6xl px-4 py-3">
                    <Link
                        href={`/courses/${data.id}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Detail Course
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <Badge variant="secondary" className="mb-2">Preview Gratis</Badge>
                            <h1 className="text-2xl font-bold">{data.previewModule.title}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Dari course: {data.title}
                            </p>
                        </div>

                        <Separator />

                        {/* Lessons */}
                        <div className="space-y-8">
                            {data.previewModule.lessons.map((lesson, idx) => (
                                <div key={lesson.id}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {getLessonIcon(lesson.type)}
                                        <h3 className="text-lg font-semibold">
                                            Pelajaran {idx + 1}: {lesson.title}
                                        </h3>
                                    </div>
                                    {lesson.content ? (
                                        <div className="prose prose-sm max-w-none rounded-lg border bg-card p-6 dark:prose-invert">
                                            <MarkdownRenderer content={lesson.content} />
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border bg-muted/50 p-6 text-center text-muted-foreground">
                                            <p>Konten belum tersedia</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA Banner */}
                        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-8 text-center space-y-4">
                            <GraduationCap className="h-12 w-12 mx-auto text-primary" />
                            <h3 className="text-xl font-bold">Suka kontennya?</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Beli course lengkap dan akses semua {data.totalModules} modul + sertifikat kelulusan!
                            </p>
                            <Link href={`/portal/checkout/course/${data.id}`}>
                                <Button size="lg" className="mt-2">
                                    {isFree
                                        ? 'Ambil Kursus Gratis'
                                        : `Beli Kursus — ${formatRupiah(effectivePrice)}`}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-4">
                            {/* Module list */}
                            <Card>
                                <CardContent className="p-4 space-y-2">
                                    <h3 className="font-semibold text-sm mb-3">Kurikulum</h3>
                                    {data.allModules.map((mod, idx) => (
                                        <div
                                            key={mod.id}
                                            className="flex items-center gap-2 text-sm py-1"
                                        >
                                            {idx === 0 ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                            ) : (
                                                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                            )}
                                            <span className={idx === 0 ? 'font-medium' : 'text-muted-foreground'}>
                                                {mod.title}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Price */}
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <p className="text-sm text-muted-foreground">Harga:</p>
                                    <p className="text-xl font-bold">
                                        {isFree ? 'Gratis' : formatRupiah(effectivePrice)}
                                    </p>
                                    <Link href={`/portal/checkout/course/${data.id}`} className="block">
                                        <Button className="w-full">
                                            {isFree ? 'Ambil Gratis' : 'Beli Kursus'}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
