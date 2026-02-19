'use client'

import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  type: string
  content: string | null
  videoUrl: string | null
  fileUrl: string | null
  duration: number | null
  order: number
}

interface CourseModule {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface CoursePlayerProps {
  modules: CourseModule[]
  courseTitle: string
  progress: number
}

const lessonTypeIcon: Record<string, React.ElementType> = {
  VIDEO: Video,
  DOCUMENT: FileText,
  TEXT: BookOpen,
}

const lessonTypeLabel: Record<string, string> = {
  VIDEO: 'Video',
  DOCUMENT: 'Dokumen',
  TEXT: 'Teks',
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ]
  for (const pat of patterns) {
    const m = url.match(pat)
    if (m) return m[1]
  }
  return null
}

function LessonViewer({ lesson }: { lesson: Lesson }) {
  if (lesson.type === 'VIDEO') {
    const youtubeId = lesson.videoUrl ? getYoutubeId(lesson.videoUrl) : null

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        {youtubeId ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : lesson.videoUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <video
              src={lesson.videoUrl}
              controls
              className="h-full w-full"
              title={lesson.title}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-secondary">
            <div className="text-center">
              <Video className="mx-auto mb-2 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">URL video belum diset</p>
            </div>
          </div>
        )}
        {lesson.duration && (
          <p className="text-xs text-muted-foreground">
            Durasi: {lesson.duration} menit
          </p>
        )}
      </div>
    )
  }

  if (lesson.type === 'DOCUMENT') {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        {lesson.fileUrl ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed py-16">
            <FileText className="h-14 w-14 text-primary/40" />
            <div className="text-center">
              <p className="font-medium">Dokumen tersedia</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Klik tombol di bawah untuk membuka dokumen
              </p>
            </div>
            <Button asChild>
              <a
                href={lesson.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Buka Dokumen
              </a>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              URL dokumen belum diset
            </p>
          </div>
        )}
        {lesson.content && (
          <div className="prose prose-sm max-w-none rounded-lg bg-secondary/30 p-4 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{lesson.content}</p>
          </div>
        )}
      </div>
    )
  }

  // TEXT
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{lesson.title}</h2>
      {lesson.content ? (
        <div className="rounded-lg bg-secondary/30 p-6 text-sm leading-relaxed">
          <p className="whitespace-pre-wrap text-foreground">{lesson.content}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Konten belum tersedia</p>
        </div>
      )}
    </div>
  )
}

export function CoursePlayer({ modules, courseTitle, progress }: CoursePlayerProps) {
  const allLessons = modules.flatMap((m) => m.lessons)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    allLessons[0]?.id ?? null
  )
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  )

  const selectedLesson =
    allLessons.find((l) => l.id === selectedLessonId) ?? null

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const selectedModuleIdx = modules.findIndex((m) =>
    m.lessons.some((l) => l.id === selectedLessonId)
  )
  const selectedLessonIdx =
    selectedModuleIdx >= 0
      ? modules[selectedModuleIdx].lessons.findIndex(
          (l) => l.id === selectedLessonId
        )
      : -1

  function goNext() {
    if (selectedModuleIdx < 0) return
    const currentModule = modules[selectedModuleIdx]
    if (selectedLessonIdx < currentModule.lessons.length - 1) {
      setSelectedLessonId(currentModule.lessons[selectedLessonIdx + 1].id)
    } else if (selectedModuleIdx < modules.length - 1) {
      const nextModule = modules[selectedModuleIdx + 1]
      if (nextModule.lessons.length > 0) {
        setSelectedLessonId(nextModule.lessons[0].id)
        setExpandedModules((prev) => new Set([...prev, nextModule.id]))
      }
    }
  }

  function goPrev() {
    if (selectedModuleIdx < 0) return
    if (selectedLessonIdx > 0) {
      const currentModule = modules[selectedModuleIdx]
      setSelectedLessonId(currentModule.lessons[selectedLessonIdx - 1].id)
    } else if (selectedModuleIdx > 0) {
      const prevModule = modules[selectedModuleIdx - 1]
      if (prevModule.lessons.length > 0) {
        setSelectedLessonId(
          prevModule.lessons[prevModule.lessons.length - 1].id
        )
      }
    }
  }

  const isFirst = selectedModuleIdx === 0 && selectedLessonIdx === 0
  const isLast =
    selectedModuleIdx === modules.length - 1 &&
    selectedLessonIdx ===
      (modules[selectedModuleIdx]?.lessons.length ?? 0) - 1

  if (allLessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Kursus ini belum memiliki pelajaran
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Sidebar — lesson list */}
      <aside className="w-full shrink-0 rounded-xl border bg-card lg:w-72 xl:w-80">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Konten Kursus</p>
          <p className="text-xs text-muted-foreground">
            {allLessons.length} pelajaran · {progress}% selesai
          </p>
        </div>
        <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModules.has(mod.id)
            return (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-accent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {modIdx + 1}. {mod.title}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {mod.lessons.length}
                  </span>
                </button>
                {isExpanded && (
                  <div>
                    {mod.lessons.map((lesson, lessonIdx) => {
                      const Icon = lessonTypeIcon[lesson.type] ?? BookOpen
                      const isSelected = lesson.id === selectedLessonId
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className={cn(
                            'flex w-full items-center gap-3 py-2.5 pl-10 pr-4 text-left transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-accent'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                              isSelected ? 'bg-primary' : 'bg-secondary'
                            )}
                          >
                            {isSelected ? (
                              <PlayCircle className="h-3.5 w-3.5 text-primary-foreground" />
                            ) : (
                              <Icon
                                className={cn(
                                  'h-3.5 w-3.5',
                                  isSelected
                                    ? 'text-primary-foreground'
                                    : 'text-muted-foreground'
                                )}
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                'truncate text-xs',
                                isSelected ? 'font-medium' : ''
                              )}
                            >
                              {lessonIdx + 1}. {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {lessonTypeLabel[lesson.type]}
                              {lesson.duration
                                ? ` · ${lesson.duration} mnt`
                                : ''}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-4">
        {/* Type badge */}
        {selectedLesson && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {lessonTypeLabel[selectedLesson.type] ?? selectedLesson.type}
            </Badge>
            {selectedModuleIdx >= 0 && (
              <span className="text-xs text-muted-foreground">
                Modul {selectedModuleIdx + 1} ·{' '}
                {modules[selectedModuleIdx].title}
              </span>
            )}
          </div>
        )}

        {/* Lesson content */}
        {selectedLesson ? (
          <LessonViewer lesson={selectedLesson} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Pilih pelajaran untuk mulai belajar
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={isFirst}
          >
            ← Sebelumnya
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {selectedModuleIdx >= 0 && selectedLessonIdx >= 0
                ? `${allLessons.indexOf(selectedLesson!) + 1} / ${allLessons.length}`
                : ''}
            </span>
          </div>
          <Button size="sm" onClick={goNext} disabled={isLast}>
            Berikutnya →
          </Button>
        </div>
      </div>
    </div>
  )
}
