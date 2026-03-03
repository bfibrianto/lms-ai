'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableCourseItemProps {
    id: string
    disabled?: boolean
    children: React.ReactNode
}

export function SortableCourseItem({ id, disabled, children }: SortableCourseItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
    }

    return (
        <div ref={setNodeRef} style={style}>
            {/* Drag handle overlay */}
            {!disabled && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-0 top-0 z-10 flex h-full w-8 cursor-grab items-start justify-center pt-4 active:cursor-grabbing"
                    aria-label="Drag untuk mengatur urutan"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            <div className={!disabled ? 'pl-6' : ''}>{children}</div>
        </div>
    )
}
