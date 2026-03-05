import { getCoursePublicDetail } from '@/lib/actions/courses'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatRupiah, calculateDiscount } from '@/lib/utils/format-currency'
import {
    BookOpen,
    GraduationCap,
    Users,
    ArrowLeft,
    Lock,
    Unlock,
    FileText,
    Video,
    HelpCircle,
    CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

const levelLabels: Record<string, string> = {
    BEGINNER: 'Pemula',
    INTERMEDIATE: 'Menengah',
    ADVANCED: 'Lanjutan',
}

function getLessonIcon(type: string) {
    switch (type) {
        case 'VIDEO':
            return <Video className="h-4 w-4 text-muted-foreground" />
        case 'QUIZ':
            return <HelpCircle className="h-4 w-4 text-muted-foreground" />
        default:
            return <FileText className="h-4 w-4 text-muted-foreground" />
    }
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const course = await getCoursePublicDetail(id)

    if (!course) notFound()

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const effectivePrice = course.promoPrice ?? course.price ?? 0
    const hasDiscount = course.promoPrice != null && course.price != null && course.promoPrice < course.price
    const isFree = effectivePrice === 0

    return (
        <div className="min-h-screen bg-background">
            {/* Top Nav */}
            <div className="border-b">
                <div className="container mx-auto max-w-6xl px-4 py-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero */}
                        {course.thumbnail && (
                            <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <Badge variant="secondary">{levelLabels[course.level] || course.level}</Badge>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" /> {course.modules.length} Modul
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" /> {totalLessons} Pelajaran
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" /> {course._count.enrollments} Peserta
                                </span>
                            </div>
                            {course.creator?.name && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Oleh <span className="font-medium text-foreground">{course.creator.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {course.description && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">Deskripsi</h2>
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p className="whitespace-pre-wrap">{course.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Curriculum */}
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Kurikulum</h2>
                            <Accordion type="multiple" defaultValue={['module-0']} className="space-y-2">
                                {course.modules.map((mod, idx) => {
                                    const isPreview = idx === 0
                                    return (
                                        <AccordionItem
                                            key={mod.id}
                                            value={`module-${idx}`}
                                            className="border rounded-lg px-4"
                                        >
                                            <AccordionTrigger className="hover:no-underline">
                                                <div className="flex items-center gap-3 text-left">
                                                    {isPreview ? (
                                                        <Unlock className="h-4 w-4 text-green-600 shrink-0" />
                                                    ) : (
                                                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    )}
                                                    <div>
                                                        <span className="font-medium">{mod.title}</span>
                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                            {mod.lessons.length} pelajaran
                                                        </span>
                                                    </div>
                                                    {isPreview && (
                                                        <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                                                            Preview Gratis
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="space-y-2 pb-2">
                                                    {mod.lessons.map((lesson) => (
                                                        <li
                                                            key={lesson.id}
                                                            className="flex items-center gap-3 text-sm text-muted-foreground pl-7"
                                                        >
                                                            {getLessonIcon(lesson.type)}
                                                            <span>{lesson.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>

                            {course.modules.length > 0 && (
                                <div className="mt-4">
                                    <Link href={`/courses/${course.id}/preview`}>
                                        <Button variant="outline" className="gap-2">
                                            <GraduationCap className="h-4 w-4" />
                                            Preview Modul Gratis
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    {/* Price */}
                                    <div>
                                        {isFree ? (
                                            <Badge className="bg-green-600 text-white text-lg px-3 py-1">Gratis</Badge>
                                        ) : (
                                            <div>
                                                {hasDiscount && (
                                                    <p className="text-sm text-muted-foreground line-through">
                                                        {formatRupiah(course.price!)}
                                                    </p>
                                                )}
                                                <p className="text-2xl font-bold">
                                                    {formatRupiah(effectivePrice)}
                                                </p>
                                                {hasDiscount && (
                                                    <Badge variant="destructive" className="mt-1">
                                                        DISKON {calculateDiscount(course.price!, course.promoPrice!)}%
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <Link href={`/portal/checkout/course/${course.id}`} className="block">
                                        <Button className="w-full" size="lg">
                                            {isFree ? 'Ambil Gratis' : `Beli Kursus — ${formatRupiah(effectivePrice)}`}
                                        </Button>
                                    </Link>

                                    {/* Info */}
                                    <div className="space-y-2 pt-2 border-t text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            {course.modules.length} Modul
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            {totalLessons} Pelajaran
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Sertifikat Kelulusan
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
