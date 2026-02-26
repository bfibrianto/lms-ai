import { Metadata } from 'next';
import { getSettings } from '@/lib/actions/settings';
import { SettingsForm } from '@/components/backoffice/settings/settings-form';

export const metadata: Metadata = {
    title: 'Pengaturan Global | LMS AI',
    description: 'Pengaturan akses dan integrasi API untuk LMS AI',
};

export default async function SettingsPage() {
    const initialSettings = await getSettings();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
                <p className="text-muted-foreground">
                    Kelola konfigurasi sistem dan preferensi integrasi API.
                </p>
            </div>

            <SettingsForm initialSettings={initialSettings} />
        </div>
    );
}
