'use client'

import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ChevronUp,
  ChevronDown,
  GripVertical,
  Plus,
  Pencil,
  Video,
  FileText,
  AlignLeft,
  Clock,
} from 'lucide-react'
import { updateModuleTitle, reorderModule } from '@/lib/actions/modules'
import { reorderLesson } from '@/lib/actions/lessons'
import { DeleteModuleDialog } from './delete-module-dialog'
import { DeleteLessonDialog } from './delete-lesson-dialog'
import type { ModuleWithLessons, LessonDetail, LessonType } from '@/types/courses'

const LESSON_TYPE_ICON: Record<LessonType, React.ReactNode> = {
  VIDEO: <Video className="h-3.5 w-3.5" />,
  DOCUMENT: <FileText className="h-3.5 w-3.5" />,
  TEXT: <AlignLeft className="h-3.5 w-3.5" />,
}

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
  VIDEO: 'Video',
  DOCUMENT: 'Dokumen',
  TEXT: 'Teks',
}

interface ModuleCardProps {
  module: ModuleWithLessons
  canEdit: boolean
  isFirst: boolean
  isLast: boolean
  onEditLesson: (lesson: LessonDetail) => void
  onAddLesson: () => void
}

export function ModuleCard({
  module,
  canEdit,
  isFirst,
  isLast,
  onEditLesson,
  onAddLesson,
}: ModuleCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(module.title)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleTitleClick() {
    if (!canEdit) return
    setIsEditingTitle(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleTitleSave() {
    const trimmed = titleValue.trim()
    if (trimmed === module.title) {
      setIsEditingTitle(false)
      return
    }
    if (trimmed.length < 2) {
      toast.error('Judul modul minimal 2 karakter')
      setTitleValue(module.title)
      setIsEditingTitle(false)
      return
    }
    startTransition(async () => {
      const result = await updateModuleTitle(module.id, trimmed)
      if (result.success) {
        setIsEditingTitle(false)
      } else {
        toast.error(result.error)
        setTitleValue(module.title)
        setIsEditingTitle(false)
      }
    })
  }

  function handleReorderModule(direction: 'up' | 'down') {
    startTransition(async () => {
      const result = await reorderModule(module.id, direction)
      if (!result.success) toast.error(result.error)
    })
  }

  function handleReorderLesson(lessonId: string, direction: 'up' | 'down') {
    startTransition(async () => {
      const result = await reorderLesson(lessonId, direction)
      if (!result.success) toast.error(result.error)
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-3">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />

        {/* Inline title edit */}
        <div className="flex-1">
          {isEditingTitle ? (
            <Input
              ref={inputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') inputRef.current?.blur()
                if (e.key === 'Escape') {
                  setTitleValue(module.title)
                  setIsEditingTitle(false)
                }
              }}
              className="h-7 text-sm font-semibold"
              disabled={isPending}
            />
          ) : (
            <p
              className={`text-sm font-semibold ${canEdit ? 'cursor-pointer hover:underline' : ''}`}
              onClick={handleTitleClick}
              title={canEdit ? 'Klik untuk edit judul' : undefined}
            >
              {module.title}
            </p>
          )}
        </div>

        <Badge variant="outline" className="shrink-0 text-xs">
          {module.lessons.length} pelajaran
        </Badge>

        {/* Reorder + Delete */}
        {canEdit && (
          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={isFirst || isPending}
              onClick={() => handleReorderModule('up')}
              aria-label="Pindah ke atas"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={isLast || isPending}
              onClick={() => handleReorderModule('down')}
              aria-label="Pindah ke bawah"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <DeleteModuleDialog
              moduleId={module.id}
              moduleTitle={module.title}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-1 pb-3">
        {module.lessons.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            Belum ada pelajaran
          </p>
        )}

        {module.lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
          >
            <span className="shrink-0 text-muted-foreground">
              {LESSON_TYPE_ICON[lesson.type]}
            </span>
            <span className="flex-1 truncate">{lesson.title}</span>
            <Badge variant="outline" className="shrink-0 text-xs">
              {LESSON_TYPE_LABEL[lesson.type]}
            </Badge>
            {lesson.duration && (
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lesson.duration}m
              </span>
            )}

            {canEdit && (
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={idx === 0 || isPending}
                  onClick={() => handleReorderLesson(lesson.id, 'up')}
                  aria-label="Pindah ke atas"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={idx === module.lessons.length - 1 || isPending}
                  onClick={() => handleReorderLesson(lesson.id, 'down')}
                  aria-label="Pindah ke bawah"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEditLesson(lesson)}
                  aria-label={`Edit ${lesson.title}`}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <DeleteLessonDialog
                  lessonId={lesson.id}
                  lessonTitle={lesson.title}
                />
              </div>
            )}
          </div>
        ))}

        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddLesson}
            className="mt-1 w-full text-xs text-muted-foreground"
          >
            <Plus className="mr-1.5 h-3 w-3" />
            Tambah Pelajaran
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
