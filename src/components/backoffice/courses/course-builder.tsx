'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { addModule } from '@/lib/actions/modules'
import { ModuleCard } from './module-card'
import { LessonEditorSheet } from './lesson-editor-sheet'
import type { CourseDetail, LessonDetail } from '@/types/courses'

interface CourseBuilderProps {
  initialData: CourseDetail
  canEdit: boolean
}

interface EditingLesson {
  lesson: LessonDetail | null
  moduleId: string
}

export function CourseBuilder({ initialData, canEdit }: CourseBuilderProps) {
  const [isPending, startTransition] = useTransition()
  const [editingLesson, setEditingLesson] = useState<EditingLesson | null>(null)

  function handleAddModule() {
    startTransition(async () => {
      try {
        const result = await addModule(initialData.id, 'Modul Baru')
        if (!result.success) toast.error(result.error)
      } catch {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    })
  }

  function openAddLesson(moduleId: string) {
    setEditingLesson({ lesson: null, moduleId })
  }

  function openEditLesson(lesson: LessonDetail) {
    setEditingLesson({ lesson, moduleId: lesson.moduleId })
  }

  function closeSheet() {
    setEditingLesson(null)
  }

  return (
    <div className="space-y-3">
      {initialData.modules.length === 0 && (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada modul. Tambahkan modul pertama untuk mulai membangun kursus.
          </p>
        </div>
      )}

      {initialData.modules.map((module, idx) => (
        <ModuleCard
          key={module.id}
          module={module}
          canEdit={canEdit}
          isFirst={idx === 0}
          isLast={idx === initialData.modules.length - 1}
          onEditLesson={openEditLesson}
          onAddLesson={() => openAddLesson(module.id)}
        />
      ))}

      {canEdit && (
        <Button
          variant="outline"
          onClick={handleAddModule}
          disabled={isPending}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isPending ? 'Menambahkan...' : 'Tambah Modul'}
        </Button>
      )}

      {editingLesson && (
        <LessonEditorSheet
          open={true}
          moduleId={editingLesson.moduleId}
          lesson={editingLesson.lesson}
          onClose={closeSheet}
        />
      )}
    </div>
  )
}
