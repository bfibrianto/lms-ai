'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Sparkles, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LandingHero() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="relative overflow-hidden">
            {/* Enhanced gradient background with animation */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-500/10 blur-[120px] transition-opacity duration-1000" 
                     style={{ opacity: mounted ? 1 : 0 }} />
                <div className="absolute right-0 top-1/2 h-[400px] w-[500px] rounded-full bg-indigo-400/8 blur-[100px] transition-opacity duration-1000 delay-300" 
                     style={{ opacity: mounted ? 1 : 0 }} />
                <div className="absolute left-0 bottom-0 h-[300px] w-[400px] rounded-full bg-purple-400/6 blur-[100px] transition-opacity duration-1000 delay-500" 
                     style={{ opacity: mounted ? 1 : 0 }} />
            </div>

            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28 lg:py-36">
                {/* Animated pill badge */}
                <div 
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                    style={{ 
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'all 0.6s ease-out'
                    }}
                >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    AI-Powered Learning Platform
                </div>

                {/* Animated heading */}
                <h1 
                    className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                    style={{ 
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease-out 0.2s'
                    }}
                >
                    Tingkatkan Skill Tim Anda dengan{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                        Sitamoto Academy
                    </span>
                </h1>

                {/* Animated description */}
                <p 
                    className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
                    style={{ 
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease-out 0.4s'
                    }}
                >
                    Platform online course yang dilengkapi AI untuk
                    mempermudah pembelajaran, tracking progress, dan pengembangan
                    kompetensi Anda.
                </p>

                {/* Animated CTA buttons */}
                <div 
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    style={{ 
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease-out 0.6s'
                    }}
                >
                    <Button 
                        size="lg" 
                        className="group gap-2 px-8 text-base shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" 
                        asChild
                    >
                        <Link href="/auth/login">
                            <GraduationCap className="h-5 w-5 transition-transform group-hover:scale-110" />
                            Mulai Belajar
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline" 
                        className="px-8 text-base transition-all duration-300 hover:bg-accent hover:scale-105" 
                        asChild
                    >
                        <Link href="#courses">Jelajahi Kursus</Link>
                    </Button>
                </div>

                {/* Animated trust line */}
                <p 
                    className="mt-14 text-xs font-medium uppercase tracking-widest text-muted-foreground/70"
                    style={{ 
                        opacity: mounted ? 1 : 0,
                        transition: 'opacity 1s ease-out 0.8s'
                    }}
                >
                    Dipercaya oleh banyak pembelajar di Indonesia
                </p>
            </div>
        </section>
    )
}
