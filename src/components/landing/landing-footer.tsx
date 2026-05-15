import Link from 'next/link'
import { GraduationCap, Mail, Globe } from 'lucide-react'

export function LandingFooter() {
    return (
        <footer className="border-t bg-slate-50/50 dark:bg-slate-900/20">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                Sitamoto{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Academy</span>
                            </span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Platform learning management system internal bertenaga AI
                            untuk pengembangan kompetensi karyawan.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-sm font-semibold">Platform</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link 
                                    href="/#courses" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Kursus
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/#features" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Fitur
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/portal/learning-paths" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Learning Paths
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/portal/certificates" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Sertifikat
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold">Perusahaan</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="https://sitamoto.ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    <Globe className="h-3.5 w-3.5" />
                                    Sitamoto.ai
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://sitamoto.ai/en#contact-us"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    <Mail className="h-3.5 w-3.5" />
                                    Hubungi Kami
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Access */}
                    <div>
                        <h4 className="text-sm font-semibold">Akses</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link 
                                    href="/auth/login" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Masuk
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/auth/register" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Daftar
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/backoffice" 
                                    className="inline-block transition-all duration-200 hover:text-foreground hover:translate-x-1"
                                >
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Sitamoto Academy. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Powered by{' '}
                        <a
                            href="https://sitamoto.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Sitamoto.ai
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
