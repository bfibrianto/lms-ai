'use client';

import { AI_PROVIDERS, AiProviderId } from '@/lib/ai-providers';
import { AiProviderView } from '@/lib/actions/ai-providers';
import { AiProviderCard } from './ai-provider-card';

interface AiProviderSectionProps {
    configurations: AiProviderView[];
}

export function AiProviderSection({ configurations }: AiProviderSectionProps) {
    const providerIds: AiProviderId[] = ['GEMINI', 'OPENAI', 'ANTHROPIC', 'DEEPSEEK'];

    return (
        <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerIds.map(id => {
                    const config = configurations.find(c => c.provider === id);
                    return (
                        <AiProviderCard
                            key={id}
                            providerId={id}
                            config={config}
                        />
                    );
                })}
            </div>
            {configurations.filter(c => c.isActive).length === 0 && (
                <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg text-sm flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <p className="font-semibold">Belum Ada AI Provider yang Aktif</p>
                        <p>Fitur AI (membuat silabus, kuis, evaluasi essay) tidak akan berfungsi sampai ada satu provider yang dikonfigurasi dan diaktifkan.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
