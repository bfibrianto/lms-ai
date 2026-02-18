'use client'

import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar-store'

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore()

  return (
    <div
      className={cn(
        'min-h-screen transition-all duration-200',
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}
    >
      {children}
    </div>
  )
}
