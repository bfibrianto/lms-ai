export const BACKOFFICE_ROLES = [
  'SUPER_ADMIN',
  'HR_ADMIN',
  'MENTOR',
  'LEADER',
] as const

export function isBackofficeRole(role: string): boolean {
  return (BACKOFFICE_ROLES as readonly string[]).includes(role)
}

export function getDashboardPath(role: string): string {
  return isBackofficeRole(role) ? '/backoffice/dashboard' : '/portal/dashboard'
}

export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  HR_ADMIN: 'HR Admin',
  MENTOR: 'Mentor',
  LEADER: 'Leader',
  EMPLOYEE: 'Karyawan',
}
