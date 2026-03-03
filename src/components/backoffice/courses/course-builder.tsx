'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Check, AlertCircle } from 'lucide-react'
import { addModule } from '@/lib/actions/modules'
import { batchReorderCourseItems } from '@/lib/actions/modules'
import { ModuleCard } from './module-card'
import { QuizCardInline } from './quiz-card-inline'
import { LessonEditorSheet } from './lesson-editor-sheet'
import { GenerateModulesDialog } from './generate-modules-dialog'
import type { CourseDetail, LessonDetail, CourseItem, QuizSummary } from '@/types/courses'
import { SortableCourseItem } from './sortable-course-item'

type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface CourseBuilderProps {
  initialData: CourseDetail
  quizzes: QuizSummary[]
  canEdit: boolean
}

interface EditingLesson {
  lesson: LessonDetail | null
  moduleId: string
}

export function CourseBuilder({ initialData, quizzes, canEdit }: CourseBuilderProps) {
  const [isPending, startTransition] = useTransition()
  const [editingLesson, setEditingLesson] = useState<EditingLesson | null>(null)

  // ─── Unified items state (modules + quizzes) ────────────
  const [items, setItems] = useState<CourseItem[]>(() => {
    const moduleItems: CourseItem[] = initialData.modules.map((m) => ({
      id: m.id,
      type: 'MODULE' as const,
      title: m.title,
      order: m.order,
      moduleData: m,
    }))
    const quizItems: CourseItem[] = quizzes.map((q) => ({
      id: q.id,
      type: 'QUIZ' as const,
      title: q.title,
      order: q.order,
      quizData: q,
    }))
    return [...moduleItems, ...quizItems].sort((a, b) => a.order - b.order)
  })

  // ─── Autosave for reorder ───────────────────────────────
  const [orderSaveStatus, setOrderSaveStatus] = useState<AutosaveStatus>('idle')
  const orderDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialOrderRef = useRef(items.map((i) => i.id).join(','))

  useEffect(() => {
    const currentOrder = items.map((i) => i.id).join(',')
    if (currentOrder === initialOrderRef.current) return

    if (orderDebounceRef.current) clearTimeout(orderDebounceRef.current)
    orderDebounceRef.current = setTimeout(async () => {
      setOrderSaveStatus('saving')
      try {
        const itemsToSave = items.map((item, idx) => ({
          id: item.id,
          type: item.type,
          order: idx,
        }))
        const result = await batchReorderCourseItems(initialData.id, itemsToSave)
        if (result.success) {
          initialOrderRef.current = currentOrder
          setOrderSaveStatus('saved')
          setTimeout(() => setOrderSaveStatus('idle'), 3000)
        } else {
          setOrderSaveStatus('error')
          toast.error(result.error)
        }
      } catch {
        setOrderSaveStatus('error')
        toast.error('Gagal menyimpan urutan')
      }
    }, 1500)

    return () => {
      if (orderDebounceRef.current) clearTimeout(orderDebounceRef.current)
    }
  }, [items, initialData.id])

  // ─── DnD ────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)
      return reordered.map((item, idx) => ({ ...item, order: idx }))
    })
  }

  // ─── Actions ────────────────────────────────────────────
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
      {/* Autosave status indicator */}
      {orderSaveStatus !== 'idle' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {orderSaveStatus === 'saving' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Menyimpan urutan...
            </>
          )}
          {orderSaveStatus === 'saved' && (
            <>
              <Check className="h-3 w-3 text-green-600" />
              <span className="text-green-600">Urutan tersimpan</span>
            </>
          )}
          {orderSaveStatus === 'error' && (
            <>
              <AlertCircle className="h-3 w-3 text-destructive" />
              <span className="text-destructive">Gagal menyimpan urutan</span>
            </>
          )}
        </div>
      )}

      {/* DnD sortable list */}
      {items.length === 0 && (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada modul. Tambahkan modul pertama untuk mulai membangun kursus.
          </p>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) =>
            item.type === 'MODULE' && item.moduleData ? (
              <SortableCourseItem key={item.id} id={item.id} disabled={!canEdit}>
                <ModuleCard
                  module={item.moduleData}
                  courseTitle={initialData.title}
                  canEdit={canEdit}
                  onEditLesson={openEditLesson}
                  onAddLesson={() => openAddLesson(item.moduleData!.id)}
                />
              </SortableCourseItem>
            ) : item.type === 'QUIZ' && item.quizData ? (
              <SortableCourseItem key={item.id} id={item.id} disabled={!canEdit}>
                <QuizCardInline
                  quiz={item.quizData}
                  courseId={initialData.id}
                  canEdit={canEdit}
                />
              </SortableCourseItem>
            ) : null
          )}
        </SortableContext>
      </DndContext>

      {canEdit && (
        <div className="space-y-2">
          <GenerateModulesDialog
            courseId={initialData.id}
            courseTitle={initialData.title}
            courseDescription={initialData.description ?? ''}
          />
          <Button
            variant="outline"
            onClick={handleAddModule}
            disabled={isPending}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isPending ? 'Menambahkan...' : 'Tambah Modul'}
          </Button>
        </div>
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
