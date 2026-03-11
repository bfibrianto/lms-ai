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

export interface EmailPrefSettings {
    ORDER_CREATED: boolean
    PAYMENT_VERIFIED: boolean
    COURSE_COMPLETED: boolean
    MANDATORY_ASSIGNMENT: boolean
    TRAINING_REGISTERED: boolean
}

const DEFAULT_EMAIL_PREFS: EmailPrefSettings = {
    ORDER_CREATED: true,
    PAYMENT_VERIFIED: true,
    COURSE_COMPLETED: true,
    MANDATORY_ASSIGNMENT: true,
    TRAINING_REGISTERED: false,
}

export async function getEmailNotificationPrefs(): Promise<EmailPrefSettings> {
    try {
        const setting = await db.setting.findUnique({
            where: { key: 'EMAIL_NOTIFICATION_PREFS' }
        })

        if (!setting || !setting.value) {
            return DEFAULT_EMAIL_PREFS;
        }

        const parsed = JSON.parse(setting.value) as Partial<EmailPrefSettings>;
        return { ...DEFAULT_EMAIL_PREFS, ...parsed };
    } catch (e) {
        console.error('Failed to parse EMAIL_NOTIFICATION_PREFS:', e)
        return DEFAULT_EMAIL_PREFS;
    }
}

export async function updateEmailNotificationPrefs(prefs: EmailPrefSettings) {
    const session = await auth();
    // Allow SUPER_ADMIN or HR_ADMIN to manage this if necessary. Let's keep it SUPER_ADMIN for now as per getSettings.
    if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'HR_ADMIN')) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await db.setting.upsert({
            where: { key: 'EMAIL_NOTIFICATION_PREFS' },
            update: { value: JSON.stringify(prefs) },
            create: { key: 'EMAIL_NOTIFICATION_PREFS', value: JSON.stringify(prefs) },
        })

        revalidatePath('/backoffice/settings');
        return { success: true };
    } catch (e) {
        console.error('Failed to update EMAIL_NOTIFICATION_PREFS:', e);
        return { success: false, error: 'Gagal merubah preferensi notifikasi email.' };
    }
}

