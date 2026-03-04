'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { encrypt, decrypt, maskApiKey } from '@/lib/encryption';
import { revalidatePath } from 'next/cache';

export interface AiProviderView {
    id: string;
    provider: string;       // 'GEMINI' | 'OPENAI' | ...
    maskedApiKey: string;   // 'AIza****xxYz'
    model: string;
    isActive: boolean;
    updatedAt: Date;
}

/**
 * Gets all AI providers with masked API keys.
 * Only SUPER_ADMIN can view this configuration.
 */
export async function getAiProviders(): Promise<AiProviderView[]> {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const providers = await db.aiProvider.findMany({
        orderBy: { createdAt: 'asc' },
    });

    return providers.map(p => ({
        id: p.id,
        provider: p.provider,
        maskedApiKey: maskApiKey(decrypt(p.apiKey)),
        model: p.model,
        isActive: p.isActive,
        updatedAt: p.updatedAt,
    }));
}

/**
 * Saves or updates an AI provider configuration.
 */
export async function saveAiProvider(data: {
    provider: string;
    apiKey: string;
    model: string;
}) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    if (!data.provider || !data.apiKey || !data.model) {
        return { success: false, error: 'Semua field wajib diisi.' };
    }

    try {
        const encryptedKey = encrypt(data.apiKey);

        await db.aiProvider.upsert({
            where: { provider: data.provider },
            update: {
                apiKey: encryptedKey,
                model: data.model,
            },
            create: {
                provider: data.provider,
                apiKey: encryptedKey,
                model: data.model,
                isActive: false, // Default inactive when first created
            },
        });

        revalidatePath('/backoffice/settings');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save AI provider:', error);
        return { success: false, error: 'Gagal menyimpan konfigurasi provider API.' };
    }
}

/**
 * Activates a specific provider and deactivates all others.
 */
export async function activateAiProvider(provider: string) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const targetProvider = await db.aiProvider.findUnique({
            where: { provider },
        });

        if (!targetProvider) {
            return { success: false, error: 'Provider tidak ditemukan atau belum dikonfigurasi.' };
        }

        // Run in transaction to ensure consistency
        await db.$transaction([
            // Set all to inactive
            db.aiProvider.updateMany({
                data: { isActive: false },
            }),
            // Set target to active
            db.aiProvider.update({
                where: { provider },
                data: { isActive: true },
            }),
        ]);

        revalidatePath('/backoffice/settings');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to activate AI provider:', error);
        return { success: false, error: 'Gagal mengaktifkan provider AI.' };
    }
}

/**
 * Deactivates all providers.
 */
export async function deactivateAiProvider() {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await db.aiProvider.updateMany({
            data: { isActive: false },
        });

        revalidatePath('/backoffice/settings');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to deactivate AI provider:', error);
        return { success: false, error: 'Gagal menonaktifkan provider AI.' };
    }
}

/**
 * Deletes a provider configuration.
 */
export async function deleteAiProvider(provider: string) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await db.aiProvider.delete({
            where: { provider },
        });

        revalidatePath('/backoffice/settings');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete AI provider:', error);
        return { success: false, error: 'Gagal menghapus konfigurasi provider.' };
    }
}

/**
 * Reads the full decrypted API key. Useful for the "Show" button in the UI.
 * Highly restricted to SUPER_ADMIN.
 */
export async function revealApiKey(provider: string) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const record = await db.aiProvider.findUnique({
            where: { provider },
        });

        if (!record) {
            return { success: false, error: 'Konfigurasi tidak ditemukan.' };
        }

        const decryptedKey = decrypt(record.apiKey);
        return { success: true, key: decryptedKey };
    } catch (error: any) {
        console.error('Failed to reveal API key:', error);
        return { success: false, error: 'Gagal menampilkan API Key.' };
    }
}

/**
 * Tests the connection to the specified AI provider.
 */
export async function testAiConnection(provider: string) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const record = await db.aiProvider.findUnique({
            where: { provider },
        });

        if (!record) {
            return { success: false, error: 'Konfigurasi tidak ditemukan.' };
        }

        const apiKey = decrypt(record.apiKey);

        // This relies on the new dynamic getAiClient logic if we want to use the app's standard flow.
        // For simplicity and speed in testing, we just try a lightweight API fetch.

        const startTime = Date.now();
        let success = false;
        let errorMessage = '';

        try {
            if (provider === 'GEMINI') {
                // Test Google Gemini (REST API format)
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${record.model}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Hello, just reply with 'OK'." }] }]
                    })
                });
                if (res.ok) success = true;
                else errorMessage = `API Error: ${res.status} ${res.statusText}`;
            }
            else if (provider === 'OPENAI') {
                const res = await fetch('https://api.openai.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (res.ok) success = true;
                else errorMessage = `API Error: ${res.status} ${res.statusText}`;
            }
            else if (provider === 'ANTHROPIC') {
                const res = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: record.model,
                        max_tokens: 10,
                        messages: [{ role: 'user', content: 'Say OK' }]
                    })
                });
                if (res.ok) success = true;
                else errorMessage = `API Error: ${res.status} ${res.statusText}`;
            }
            else if (provider === 'DEEPSEEK') {
                const res = await fetch('https://api.deepseek.com/models', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (res.ok) success = true;
                else errorMessage = `API Error: ${res.status} ${res.statusText}`;
            }
        } catch (fetchError: any) {
            errorMessage = fetchError.message || 'Network error';
        }

        const latency = Date.now() - startTime;

        if (success) {
            return { success: true, latency };
        } else {
            return { success: false, error: errorMessage || 'Koneksi gagal atau API Key tidak valid.' };
        }
    } catch (error: any) {
        console.error('Test connection failed:', error);
        return { success: false, error: 'Gagal melakukan tes koneksi.' };
    }
}
