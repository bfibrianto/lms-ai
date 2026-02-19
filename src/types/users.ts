import type { Role } from '@/generated/prisma/client'

export type UserListItem = {
  id: string
  name: string
  email: string
  role: Role
  department: string | null
  position: string | null
  isActive: boolean
  createdAt: Date
}

export type UserDetail = {
  id: string
  name: string
  email: string
  role: Role
  department: string | null
  position: string | null
  isActive: boolean
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
