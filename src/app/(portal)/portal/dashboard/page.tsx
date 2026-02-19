import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  PlayCircle,
} from 'lucide-react'

const levelLabels: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

const enrollmentStatusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  ENROLLED: { label: 'Terdaftar', variant: 'secondary' },
  IN_PROGRESS: { label: 'Berlangsung', variant: 'default' },
  COMPLETED: { label: 'Selesai', variant: 'outline' },
  DROPPED: { label: 'Dibatalkan', variant: 'outline' },
}

async function getUserStats(userId: string) {
  const [enrollments, availableCourses, totalEnrolled, completed, inProgress] =
    await Promise.all([
      db.enrollment.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          status: true,
          progress: true,
          course: {
            select: {
              id: true,
              title: true,
              level: true,
              _count: { select: { modules: true } },
            },
          },
        },
      }),
      db.course.count({ where: { status: 'PUBLISHED' } }),
      db.enrollment.count({ where: { userId } }),
      db.enrollment.count({ where: { userId, status: 'COMPLETED' } }),
      db.enrollment.count({ where: { userId, status: 'IN_PROGRESS' } }),
    ])

  return { enrollments, availableCourses, totalEnrolled, completed, inProgress }
}

export default async function PortalDashboard() {
  const session = await auth()
  const userId = session?.user?.id ?? ''
  const stats = await getUserStats(userId)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting()}, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Selamat datang kembali. Lanjutkan perjalanan belajarmu.
          </p>
        </div>
        <Button asChild>
          <Link href="/portal/courses">
            <GraduationCap className="mr-2 h-4 w-4" />
            Jelajahi Kursus
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Terdaftar</CardDescription>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEnrolled}</div>
            <p className="mt-1 text-xs text-muted-foreground">kursus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Sedang Belajar</CardDescription>
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inProgress}</div>
            <p className="mt-1 text-xs text-muted-foreground">kursus aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Selesai</CardDescription>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
            <p className="mt-1 text-xs text-muted-foreground">kursus selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Kursus Terkini</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/portal/my-courses">
                Lihat semua
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {stats.enrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Kamu belum mendaftar kursus apapun.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/portal/courses">Jelajahi Kursus</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {stats.enrollments.map((enrollment) => {
                const sc = enrollmentStatusConfig[enrollment.status] ?? {
                  label: enrollment.status,
                  variant: 'secondary' as const,
                }
                return (
                  <Link
                    key={enrollment.id}
                    href={`/portal/my-courses/${enrollment.course.id}`}
                    className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {enrollment.course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {levelLabels[enrollment.course.level] ??
                          enrollment.course.level}{' '}
                        · {enrollment.course._count.modules} modul
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={sc.variant} className="text-xs">
                        {sc.label}
                      </Badge>
                      {enrollment.progress > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {enrollment.progress}%
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available courses promo */}
      {stats.availableCourses > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {stats.availableCourses} kursus tersedia
              </p>
              <p className="text-xs text-muted-foreground">
                Mulai belajar hal baru hari ini
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/portal/courses">
                <PlayCircle className="mr-1.5 h-4 w-4" />
                Mulai Belajar
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
