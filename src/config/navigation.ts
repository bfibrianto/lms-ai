import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  Settings,
  ClipboardList,
  Route,
  GraduationCap,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  roles?: string[]
}

export const backofficeNav: NavItem[] = [
  { title: 'Dashboard', href: '/backoffice/dashboard', icon: LayoutDashboard },
  {
    title: 'Pengguna',
    href: '/backoffice/users',
    icon: Users,
    roles: ['SUPER_ADMIN', 'HR_ADMIN'],
  },
  { title: 'Kursus', href: '/backoffice/courses', icon: BookOpen },
  { title: 'Pelatihan', href: '/backoffice/trainings', icon: ClipboardList },
  { title: 'Learning Path', href: '/backoffice/learning-paths', icon: Route },
  { title: 'Sertifikat', href: '/backoffice/certificates', icon: Award },
  {
    title: 'Pengaturan',
    href: '/backoffice/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN'],
  },
]

export const portalNav: NavItem[] = [
  { title: 'Beranda', href: '/portal/dashboard', icon: LayoutDashboard },
  { title: 'Katalog Kursus', href: '/portal/courses', icon: GraduationCap },
  { title: 'Kursus Saya', href: '/portal/my-courses', icon: BookOpen },
  { title: 'Pelatihan', href: '/portal/trainings', icon: ClipboardList },
  { title: 'Learning Path', href: '/portal/learning-paths', icon: Route },
  { title: 'Leaderboard', href: '/portal/leaderboard', icon: Trophy },
  { title: 'Sertifikat', href: '/portal/certificates', icon: Award },
]
