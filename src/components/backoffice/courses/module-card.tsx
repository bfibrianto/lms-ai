'use client'

import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Pencil,
  Video,
  FileText,
  AlignLeft,
  Clock,
} from 'lucide-react'
import { updateModuleTitle } from '@/lib/actions/modules'
import { DeleteModuleDialog } from './delete-module-dialog'
import { DeleteLessonDialog } from './delete-lesson-dialog'
import { GenerateLessonsDialog } from './generate-lessons-dialog'
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
  courseTitle: string
  canEdit: boolean
  onEditLesson: (lesson: LessonDetail) => void
  onAddLesson: () => void
}

export function ModuleCard({
  module,
  courseTitle,
  canEdit,
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-3">
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

        {/* Delete module */}
        {canEdit && (
          <div className="flex shrink-0 items-center gap-0.5">
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

        {module.lessons.map((lesson) => (
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
          <div className="mt-1 flex items-center gap-1">
            <GenerateLessonsDialog
              moduleId={module.id}
              moduleTitle={module.title}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddLesson}
              className="text-xs text-muted-foreground"
            >
              <Plus className="mr-1.5 h-3 w-3" />
              Tambah Pelajaran
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
