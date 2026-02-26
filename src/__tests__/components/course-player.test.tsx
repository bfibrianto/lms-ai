import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CoursePlayer } from '@/components/portal/courses/course-player'

// Mock server actions
vi.mock('@/lib/actions/enrollments', () => ({
    completeLesson: vi.fn(),
    updateLastAccessed: vi.fn(),
}))

// Mock sonner
vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

const mockModules = [
    {
        id: 'mod-1',
        title: 'Modul Pertama',
        order: 1,
        lessons: [
            {
                id: 'lesson-1',
                title: 'Introduction',
                type: 'TEXT',
                content: 'Welcome to the course!',
                videoUrl: null,
                fileUrl: null,
                duration: null,
                order: 1,
            },
            {
                id: 'lesson-2',
                title: 'Getting Started',
                type: 'TEXT',
                content: 'Let us begin...',
                videoUrl: null,
                fileUrl: null,
                duration: null,
                order: 2,
            },
        ],
    },
    {
        id: 'mod-2',
        title: 'Modul Kedua',
        order: 2,
        lessons: [
            {
                id: 'lesson-3',
                title: 'Advanced Topics',
                type: 'VIDEO',
                content: null,
                videoUrl: 'https://youtube.com/watch?v=test123',
                fileUrl: null,
                duration: 30,
                order: 1,
            },
        ],
    },
]

const defaultProps = {
    modules: mockModules,
    courseTitle: 'Test Course',
    courseId: 'course-1',
    progress: 0,
    completedLessonIds: [] as string[],
    lastLessonId: null as string | null,
}

describe('CoursePlayer', () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    describe('rendering', () => {
        it('renders sidebar with header', () => {
            render(<CoursePlayer {...defaultProps} />)
            expect(screen.getByText('Konten Kursus')).toBeInTheDocument()
        })

        it('renders all module titles', () => {
            render(<CoursePlayer {...defaultProps} />)
            expect(screen.getAllByText(/Modul Pertama/).length).toBeGreaterThanOrEqual(1)
            expect(screen.getAllByText(/Modul Kedua/).length).toBeGreaterThanOrEqual(1)
        })

        it('renders lesson count in sidebar header', () => {
            render(<CoursePlayer {...defaultProps} progress={33} completedLessonIds={['lesson-1']} />)
            const header = screen.getByText(/pelajaran/)
            expect(header.textContent).toContain('1/3')
            expect(header.textContent).toContain('33%')
        })

        it('displays first lesson content by default', () => {
            render(<CoursePlayer {...defaultProps} />)
            expect(screen.getByText('Welcome to the course!')).toBeInTheDocument()
        })

        it('displays empty state when no lessons', () => {
            render(
                <CoursePlayer
                    {...defaultProps}
                    modules={[{ id: 'm', title: 'Empty', order: 1, lessons: [] }]}
                />
            )
            expect(screen.getByText(/belum memiliki pelajaran/)).toBeInTheDocument()
        })

        it('shows module completion counts', () => {
            render(<CoursePlayer {...defaultProps} completedLessonIds={['lesson-1']} />)

            // Use getAllByText since module names appear in both sidebar and badge area
            const mod1Matches = screen.getAllByText(/Modul Pertama/)
            const mod1Btn = mod1Matches[0].closest('button')
            expect(mod1Btn?.textContent).toContain('1/2')

            const mod2Matches = screen.getAllByText(/Modul Kedua/)
            const mod2Btn = mod2Matches[0].closest('button')
            expect(mod2Btn?.textContent).toContain('0/1')
        })
    })

    describe('resume from last lesson', () => {
        it('resumes from lastLessonId', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId="lesson-2" />)
            expect(screen.getByText('Let us begin...')).toBeInTheDocument()
        })

        it('falls back to first lesson when lastLessonId is null', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId={null} />)
            expect(screen.getByText('Welcome to the course!')).toBeInTheDocument()
        })

        it('falls back to first lesson when lastLessonId is invalid', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId="nonexistent" />)
            expect(screen.getByText('Welcome to the course!')).toBeInTheDocument()
        })
    })

    describe('navigation', () => {
        it('navigates to next lesson', () => {
            render(<CoursePlayer {...defaultProps} />)
            fireEvent.click(screen.getByText('Berikutnya →'))
            expect(screen.getByText('Let us begin...')).toBeInTheDocument()
        })

        it('navigates to previous lesson', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId="lesson-2" />)
            fireEvent.click(screen.getByText('← Sebelumnya'))
            expect(screen.getByText('Welcome to the course!')).toBeInTheDocument()
        })

        it('disables previous on first lesson', () => {
            render(<CoursePlayer {...defaultProps} />)
            expect(screen.getByText('← Sebelumnya').closest('button')).toBeDisabled()
        })

        it('disables next on last lesson', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId="lesson-3" />)
            expect(screen.getByText('Berikutnya →').closest('button')).toBeDisabled()
        })

        it('navigates across modules', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId="lesson-2" />)
            fireEvent.click(screen.getByText('Berikutnya →'))
            // Should render YouTube iframe for video lesson
            const iframe = document.querySelector('iframe')
            expect(iframe).toBeTruthy()
            expect(iframe?.getAttribute('src')).toContain('youtube.com/embed/test123')
        })

        it('switches lesson when clicking sidebar item', () => {
            render(<CoursePlayer {...defaultProps} />)
            const buttons = screen.getAllByRole('button')
            const target = buttons.find((b) => b.textContent?.includes('Getting Started'))
            fireEvent.click(target!)
            expect(screen.getByText('Let us begin...')).toBeInTheDocument()
        })
    })

    describe('completion tracking', () => {
        it('shows "Tandai Selesai" for incomplete lesson', () => {
            render(<CoursePlayer {...defaultProps} />)
            expect(screen.getByText('Tandai Selesai')).toBeInTheDocument()
        })

        it('hides "Tandai Selesai" for completed lesson', () => {
            render(<CoursePlayer {...defaultProps} completedLessonIds={['lesson-1']} />)
            expect(screen.queryByText('Tandai Selesai')).not.toBeInTheDocument()
        })

        it('shows "Selesai" badge for completed lesson', () => {
            render(<CoursePlayer {...defaultProps} completedLessonIds={['lesson-1']} />)
            expect(screen.getByText('Selesai')).toBeInTheDocument()
        })

        it('shows "Tandai Selesai" when navigating to incomplete lesson', () => {
            render(
                <CoursePlayer
                    {...defaultProps}
                    completedLessonIds={['lesson-1']}
                    lastLessonId="lesson-2"
                />
            )
            expect(screen.getByText('Tandai Selesai')).toBeInTheDocument()
        })
    })

    describe('lesson types', () => {
        it('renders YouTube embed for VIDEO type', () => {
            render(<CoursePlayer {...defaultProps} lastLessonId="lesson-3" />)
            const iframe = document.querySelector('iframe')
            expect(iframe).toBeTruthy()
            expect(iframe?.getAttribute('src')).toContain('youtube.com/embed/test123')
        })

        it('renders text content for TEXT type', () => {
            render(<CoursePlayer {...defaultProps} />)
            expect(screen.getByText('Welcome to the course!')).toBeInTheDocument()
        })
    })
})
