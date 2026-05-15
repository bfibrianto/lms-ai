'use client'

import {
    Sparkles,
    ShieldCheck,
    BarChart3,
    BookOpenCheck,
    Users,
    Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Assistant',
        description:
            'Pahami pelajaran lebih mudah, dan buat ringkasan kursus secara otomatis dengan AI. Hemat waktu membuat catatan materi hingga 10x lipat.',
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40',
        hoverColor: 'group-hover:bg-blue-600 group-hover:text-white',
    },
    {
        icon: BarChart3,
        title: 'Progress Tracking',
        description:
            'Pantau progress belajar setiap anda secara real-time. Dashboard analytics untuk insight pengembangan kompetensi.',
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40',
        hoverColor: 'group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
        icon: BookOpenCheck,
        title: 'Quiz & Assessment',
        description:
            'Kerjakan quiz interaktif untuk mengukur pemahaman. Dukungan passing score, timer, dan review hasil jawaban.',
        color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40',
        hoverColor: 'group-hover:bg-amber-600 group-hover:text-white',
    },
    {
        icon: ShieldCheck,
        title: 'Sertifikat Digital',
        description:
            'Sertifikat otomatis setelah menyelesaikan kursus. Validasi digital untuk portofolio karyawan.',
        color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/40',
        hoverColor: 'group-hover:bg-rose-600 group-hover:text-white',
    },
]

export function LandingFeatures() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    return (
        <section ref={sectionRef} className="bg-slate-50/50 py-20 dark:bg-slate-900/20">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div 
                    className="text-center"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s ease-out'
                    }}
                >
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        Fitur Unggulan
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                        Mengapa Sitamoto Academy?
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Platform yang dirancang untuk mempercepat pengembangan
                        kompetensi Anda terkait teknologi AI terkini.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f, index) => (
                        <div
                            key={f.title}
                            className="group rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                transition: `all 0.6s ease-out ${index * 0.1}s`
                            }}
                        >
                            <div
                                className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300 ${f.color} ${f.hoverColor}`}
                            >
                                <f.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <h3 className="mt-4 font-semibold transition-colors duration-200 group-hover:text-primary">
                                {f.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
