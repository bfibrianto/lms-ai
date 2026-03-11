import { Metadata } from 'next';
import { getSettings, getEmailNotificationPrefs } from '@/lib/actions/settings';
import { getAiProviders } from '@/lib/actions/ai-providers';
import { SettingsForm } from '@/components/backoffice/settings/settings-form';
import { AiProviderSection } from '@/components/backoffice/settings/ai-provider-section';
import { EmailNotificationSection } from '@/components/backoffice/settings/email-notification-section';

export const metadata: Metadata = {
    title: 'Pengaturan Global | LMS AI',
    description: 'Pengaturan akses dan integrasi API untuk LMS AI',
};

export default async function SettingsPage() {
    const initialSettings = await getSettings();
    const providers = await getAiProviders();
    const emailPrefs = await getEmailNotificationPrefs();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
                <p className="text-muted-foreground">
                    Kelola konfigurasi sistem dan preferensi integrasi API.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Integrasi AI Provider</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Konfigurasi penyedia dan model AI untuk platform. Hanya satu provider yang dapat aktif pada satu waktu.
                    </p>
                </div>
                <AiProviderSection configurations={providers} />
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Notifikasi Email</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Pilih notifikasi otomatis apa saja yang diizinkan untuk dikirim via email kepada partisipan. Fitur notifikasi dalam-aplikasi (in-app) akan selalu menyala.
                    </p>
                </div>
                <EmailNotificationSection initialPrefs={emailPrefs} />
            </div>

            <SettingsForm initialSettings={initialSettings} />
        </div>
    );
}
