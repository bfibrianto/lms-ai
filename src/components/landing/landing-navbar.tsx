'use client'

import Link from 'next/link'
import { GraduationCap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useState, useEffect } from 'react'

export function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header 
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${
                scrolled 
                    ? 'bg-background/95 backdrop-blur-xl shadow-sm' 
                    : 'bg-background/80 backdrop-blur-lg'
            }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* Logo */}
                <Link 
                    href="/" 
                    className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md transition-shadow hover:shadow-lg">
                        <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">
                        Sitamoto <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Academy</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link
                        href="/#courses"
                        className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
                    >
                        Kursus
                    </Link>
                    <Link
                        href="/#features"
                        className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
                    >
                        Fitur
                    </Link>
                    <a
                        href="https://sitamoto.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
                    >
                        Sitamoto.ai
                    </a>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-1 sm:flex sm:gap-3">
                    <ThemeToggle />
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild 
                        className="transition-all duration-200 hover:bg-accent"
                    >
                        <Link href="/auth/login">Masuk</Link>
                    </Button>
                    <Button 
                        size="sm" 
                        asChild
                        className="shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                    >
                        <Link href="/auth/register">Daftar</Link>
                    </Button>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 sm:hidden">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t bg-background/95 backdrop-blur-xl md:hidden">
                    <nav className="mx-auto max-w-6xl space-y-1 px-4 py-4">
                        <Link
                            href="/#courses"
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Kursus
                        </Link>
                        <Link
                            href="/#features"
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Fitur
                        </Link>
                        <a
                            href="https://sitamoto.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            Sitamoto.ai
                        </a>
                        <div className="flex gap-2 pt-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                asChild 
                                className="flex-1"
                            >
                                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                                    Masuk
                                </Link>
                            </Button>
                            <Button 
                                size="sm" 
                                asChild
                                className="flex-1"
                            >
                                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                                    Daftar
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
