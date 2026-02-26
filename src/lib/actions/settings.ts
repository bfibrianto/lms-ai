'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const ALLOWED_SETTING_KEYS = [
    'GEMINI_API_KEY',
    'PROMPT_CONTENT_GENERATION',
    'PROMPT_QUIZ_GENERATION',
    'PROMPT_ESSAY_GRADING',
];

export async function getSettings() {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const settings = await db.setting.findMany({
        where: {
            key: { in: ALLOWED_SETTING_KEYS }
        }
    });

    const settingsMap = settings.reduce((acc, current) => {
        acc[current.key] = current.value;
        return acc;
    }, {} as Record<string, string>);

    return settingsMap;
}

export async function updateSettings(data: Record<string, string>) {
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const transactions = [];

        for (const key of Object.keys(data)) {
            if (ALLOWED_SETTING_KEYS.includes(key)) {
                transactions.push(
                    db.setting.upsert({
                        where: { key },
                        update: { value: data[key] },
                        create: { key, value: data[key] },
                    })
                );
            }
        }

        await db.$transaction(transactions);

        revalidatePath('/backoffice/settings');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Gagal memperbarui pengaturan.' };
    }
}
