import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Route, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPortalLearningPaths } from '@/lib/actions/path-enrollments'

export default async function PortalLearningPathsPage() {
    const paths = await getPortalLearningPaths()

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Temukan jalur pembelajaran yang terstruktur untuk menguasai keahlian baru secara bertahap.
                </p>
            </div>

            {paths.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <Route className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Belum ada Learning Path</h2>
                    <p className="mt-2 text-muted-foreground">
                        Saat ini belum ada learning path yang diterbitkan.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paths.map((path) => {
                        const hasEnrolled = path.enrollments.length > 0

                        return (
                            <Card key={path.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-md">
                                <CardHeader className="p-0">
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        {path.thumbnail ? (
                                            <Image
                                                src={path.thumbnail}
                                                alt={path.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Route className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                                    <div>
                                        <h3 className="line-clamp-2 text-xl font-semibold">{path.title}</h3>
                                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                            {path.description || 'Tidak ada deskripsi'}
                                        </p>
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            {path.courses.length} Kursus
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            {path.creator.name}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant={hasEnrolled ? "secondary" : "default"}
                                    >
                                        <Link href={`/portal/learning-paths/${path.id}`}>
                                            {hasEnrolled ? 'Lanjutkan Belajar' : 'Lihat Detail'}
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
