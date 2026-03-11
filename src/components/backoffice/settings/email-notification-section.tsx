'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateEmailNotificationPrefs, EmailPrefSettings } from '@/lib/actions/settings';
import { Loader2 } from 'lucide-react';

interface EmailNotificationSectionProps {
    initialPrefs: EmailPrefSettings;
}

export function EmailNotificationSection({ initialPrefs }: EmailNotificationSectionProps) {
    const [prefs, setPrefs] = useState<EmailPrefSettings>(initialPrefs);
    const [isPending, startTransition] = useTransition();

    const notifications = [
        {
            key: 'ORDER_CREATED' as keyof EmailPrefSettings,
            title: 'Pesanan Baru',
            description: 'Kirim email saat kustomer membuat pesanan (checkout) baru',
        },
        {
            key: 'PAYMENT_VERIFIED' as keyof EmailPrefSettings,
            title: 'Pembayaran Dikonfirmasi',
            description: 'Kirim email kwitansi setelah bukti bayar dikonfirmasi admin',
        },
        {
            key: 'TRAINING_REGISTERED' as keyof EmailPrefSettings,
            title: 'Pendaftaran Pelatihan',
            description: 'Kirim konfirmasi tiket pendaftaran sesi training publik',
        },
        {
            key: 'MANDATORY_ASSIGNMENT' as keyof EmailPrefSettings,
            title: 'Penugasan Wajib Baru',
            description: 'Kirim peringatan tugas ke pegawai saat Anda menugaskan kursus / jalan belajar wajib',
        },
        {
            key: 'COURSE_COMPLETED' as keyof EmailPrefSettings,
            title: 'Kursus Diselesaikan',
            description: 'Kirim ucapan selamat ke partsipan saat mereka menyelesaikan modul pembelajaran',
        },
    ];

    const handleToggle = (key: keyof EmailPrefSettings, value: boolean) => {
        setPrefs((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateEmailNotificationPrefs(prefs);
            if (result.success) {
                toast.success('Pengaturan notifikasi email diperbarui.');
            } else {
                toast.error(result.error || 'Gagal menyimpan pengaturan.');
            }
        });
    };

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="divide-y space-y-4">
                    {notifications.map((notif, index) => (
                        <div key={notif.key} className={`flex items-center justify-between ${index !== 0 ? 'pt-4' : ''}`}>
                            <div className="space-y-0.5">
                                <Label htmlFor={`switch-${notif.key}`} className="text-base font-medium">
                                    {notif.title}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {notif.description}
                                </p>
                            </div>
                            <Switch
                                id={`switch-${notif.key}`}
                                checked={prefs[notif.key]}
                                onCheckedChange={(checked) => handleToggle(notif.key, checked)}
                                disabled={isPending}
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Preferensi
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
