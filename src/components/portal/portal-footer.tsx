import Link from 'next/link'
import { GraduationCap, MapPin, Phone, Mail, MessageCircle } from 'lucide-react'

interface PortalFooterProps {
    businessName: string
    businessAddress: string
    businessPhone: string
    businessEmail: string
    businessWhatsapp: string
}

export function PortalFooter({
    businessName,
    businessAddress,
    businessPhone,
    businessEmail,
    businessWhatsapp,
}: PortalFooterProps) {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t bg-slate-50/50 dark:bg-slate-900/20 mt-12">
            <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/portal/dashboard" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                Sitamoto{' '}
                                <span className="text-blue-600">Academy</span>
                            </span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Platform learning management system bertenaga AI untuk pengembangan kompetensi karyawan.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-sm font-semibold">Platform</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/portal/courses" className="transition-colors hover:text-foreground">
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
                            <li>
                                <Link href="/portal/orders" className="transition-colors hover:text-foreground">
                                    Pesanan Saya
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <h4 className="text-sm font-semibold">Kontak & Alamat</h4>
                        <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                            {businessName && (
                                <li className="font-medium text-foreground">{businessName}</li>
                            )}
                            {businessAddress && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
                                    <span>{businessAddress}</span>
                                </li>
                            )}
                            {businessPhone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-blue-600" />
                                    <a
                                        href={`tel:${businessPhone}`}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {businessPhone}
                                    </a>
                                </li>
                            )}
                            {businessEmail && (
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-blue-600" />
                                    <a
                                        href={`mailto:${businessEmail}`}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {businessEmail}
                                    </a>
                                </li>
                            )}
                            {businessWhatsapp && (
                                <li className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 shrink-0 text-blue-600" />
                                    <a
                                        href={`https://wa.me/${businessWhatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-colors hover:text-foreground"
                                    >
                                        WhatsApp: {businessWhatsapp}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {year} Sitamoto Academy. All rights reserved.
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
