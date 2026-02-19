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
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Plus,
  ArrowRight,
  FileText,
  CheckCircle2,
  Archive,
  ClipboardList,
} from 'lucide-react'
import { roleLabels } from '@/lib/roles'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

async function getDashboardStats() {
  const [
    totalUsers,
    activeUsers,
    totalCourses,
    publishedCourses,
    draftCourses,
    archivedCourses,
    mentorCount,
    openTrainings,
    recentCourses,
    usersByRole,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isActive: true } }),
    db.course.count(),
    db.course.count({ where: { status: 'PUBLISHED' } }),
    db.course.count({ where: { status: 'DRAFT' } }),
    db.course.count({ where: { status: 'ARCHIVED' } }),
    db.user.count({ where: { role: 'MENTOR' } }),
    db.training.count({ where: { status: 'OPEN' } }),
    db.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        level: true,
        createdAt: true,
        creator: { select: { name: true } },
        _count: { select: { modules: true } },
      },
    }),
    db.user.groupBy({
      by: ['role'],
      _count: true,
    }),
  ])

  return {
    totalUsers,
    activeUsers,
    totalCourses,
    publishedCourses,
    draftCourses,
    archivedCourses,
    mentorCount,
    openTrainings,
    recentCourses,
    usersByRole,
  }
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  DRAFT: { label: 'Draf', variant: 'secondary' },
  PUBLISHED: { label: 'Diterbitkan', variant: 'default' },
  ARCHIVED: { label: 'Diarsipkan', variant: 'outline' },
}

export default async function BackofficeDashboard() {
  const session = await auth()
  const stats = await getDashboardStats()

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {greeting()}, {session?.user?.name?.split(' ')[0]}!
            Berikut ringkasan aktivitas LMS.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/backoffice/users/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Pengguna Baru
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/backoffice/courses/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Kursus Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* Total Users */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Pengguna</CardDescription>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.activeUsers} aktif · {stats.totalUsers - stats.activeUsers}{' '}
              nonaktif
            </p>
          </CardContent>
        </Card>

        {/* Published Courses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Kursus Diterbitkan</CardDescription>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.publishedCourses}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              dari {stats.totalCourses} total kursus
            </p>
          </CardContent>
        </Card>

        {/* Draft Courses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Kursus Draf</CardDescription>
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.draftCourses}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.archivedCourses} diarsipkan
            </p>
          </CardContent>
        </Card>

        {/* Mentors */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Mentor Aktif</CardDescription>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.mentorCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              mentor terdaftar
            </p>
          </CardContent>
        </Card>

        {/* Open Trainings */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Pelatihan Terbuka</CardDescription>
              <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/30">
                <ClipboardList className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openTrainings}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              pelatihan aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Recent Courses + User distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Kursus Terbaru</CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/backoffice/courses">
                    Lihat semua
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada kursus
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/backoffice/courses/new">Buat Kursus</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {stats.recentCourses.map((course) => {
                    const sc = statusConfig[course.status]
                    return (
                      <Link
                        key={course.id}
                        href={`/backoffice/courses/${course.id}`}
                        className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {course.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {course.creator.name} ·{' '}
                            {course._count.modules} modul ·{' '}
                            {levelLabels[course.level]}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <Badge variant={sc.variant} className="text-xs">
                            {sc.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(course.createdAt, {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Distribution */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribusi Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.usersByRole.map((item) => {
                const total = stats.totalUsers || 1
                const pct = Math.round((item._count / total) * 100)
                return (
                  <div key={item.role}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {roleLabels[item.role] ?? item.role}
                      </span>
                      <span className="font-medium">
                        {item._count}{' '}
                        <span className="text-muted-foreground">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {stats.usersByRole.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada pengguna
                </p>
              )}
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/backoffice/users">
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                    Kelola Pengguna
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Status breakdown */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Status Kursus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: 'Diterbitkan',
                  count: stats.publishedCourses,
                  icon: CheckCircle2,
                  color: 'text-green-600',
                },
                {
                  label: 'Draf',
                  count: stats.draftCourses,
                  icon: FileText,
                  color: 'text-amber-600',
                },
                {
                  label: 'Diarsipkan',
                  count: stats.archivedCourses,
                  icon: Archive,
                  color: 'text-muted-foreground',
                },
              ].map(({ label, count, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="flex-1 text-sm text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/backoffice/courses">
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                    Kelola Kursus
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
