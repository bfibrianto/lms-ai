import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { getMyEnrollments } from '@/lib/actions/enrollments'
import { MyCoursesList } from '@/components/portal/courses/my-courses-list'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Route, Users, CheckCircle2 } from 'lucide-react'

export default async function MyCoursesPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const enrollments = await getMyEnrollments(userId)

  const pathEnrollments = await db.pathEnrollment.findMany({
    where: { userId },
    include: {
      path: {
        include: {
          creator: { select: { name: true } },
          _count: { select: { courses: true } }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pembelajaran Saya</h1>
          <p className="mt-1 text-muted-foreground">
            Pantau progres kursus dan jalur belajarmu di sini.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/portal/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Katalog Kursus
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/portal/learning-paths">
              <Route className="mr-2 h-4 w-4" />
              Katalog Path
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="mb-6">
          <TabsTrigger value="courses">Kursus ({enrollments.length})</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths ({pathEnrollments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <MyCoursesList enrollments={enrollments} />
        </TabsContent>

        <TabsContent value="paths">
          {pathEnrollments.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <Route className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Belum ada Learning Path</h2>
              <p className="mt-2 text-muted-foreground max-w-sm">
                Kamu belum terdaftar di jalur pembelajaran mana pun. Eksplorasi katalog untuk mulai.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pathEnrollments.map((pe: any) => {
                const { path } = pe
                const isCompleted = !!pe.completedAt

                return (
                  <Card key={pe.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-md">
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
                        {isCompleted && (
                          <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1 text-white shadow-sm">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <h3 className="line-clamp-2 text-lg font-semibold">{path.title}</h3>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {path._count.courses} Kursus
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
                        variant={isCompleted ? "outline" : "default"}
                      >
                        <Link href={`/portal/learning-paths/${path.id}`}>
                          {isCompleted ? 'Tinjau Path' : 'Lanjutkan Belajar'}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
