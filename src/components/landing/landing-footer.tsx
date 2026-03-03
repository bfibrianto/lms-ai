import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function LandingFooter() {
    return (
        <footer className="border-t bg-slate-50/50 dark:bg-slate-900/20">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/new-lp" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                Sitamoto{' '}
                                <span className="text-blue-600">Academy</span>
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
                                <Link href="#courses" className="transition-colors hover:text-foreground">
                                    Kursus
                                </Link>
                            </li>
                            <li>
                                <Link href="/portal/learning-paths" className="transition-colors hover:text-foreground">
                                    Learning Paths
                                </Link>
                            </li>
                            <li>
                                <Link href="/portal/certificates" className="transition-colors hover:text-foreground">
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
                                    className="transition-colors hover:text-foreground"
                                >
                                    Sitamoto.ai
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://sitamoto.ai/en#contact-us"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors hover:text-foreground"
                                >
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
                                <Link href="/auth/signin" className="transition-colors hover:text-foreground">
                                    Masuk
                                </Link>
                            </li>
                            <li>
                                <Link href="/backoffice" className="transition-colors hover:text-foreground">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Sitamoto Academy. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Powered by{' '}
                        <a
                            href="https://sitamoto.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Sitamoto.ai
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
