'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { updateSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import { Loader2, KeyRound, Sparkles } from 'lucide-react';

interface SettingsFormProps {
    initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [formData, setFormData] = useState<Record<string, string>>({
        GEMINI_API_KEY: initialSettings['GEMINI_API_KEY'] || '',
        PROMPT_CONTENT_GENERATION: initialSettings['PROMPT_CONTENT_GENERATION'] || '',
        PROMPT_QUIZ_GENERATION: initialSettings['PROMPT_QUIZ_GENERATION'] || '',
        PROMPT_ESSAY_GRADING: initialSettings['PROMPT_ESSAY_GRADING'] || '',
    });

    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        startTransition(async () => {
            const res = await updateSettings(formData);
            if (res.success) {
                toast.success('Pengaturan berhasil disimpan');
            } else {
                toast.error(res.error || 'Gagal menyimpan pengaturan');
            }
        });
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        Integrasi Layanan AI (Google Gemini)
                    </CardTitle>
                    <CardDescription>
                        Konfigurasi akses API untuk fitur generasi konten, kuis, dan penilaian essay otomatis.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="gemini_key">API Key Gemini</Label>
                        <Input
                            id="gemini_key"
                            type="password"
                            placeholder="AIzaSy..."
                            value={formData['GEMINI_API_KEY']}
                            onChange={(e) => handleChange('GEMINI_API_KEY', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Prioritas API Key ini lebih tinggi dibanding environment variables (.env). Biarkan kosong untuk menggunakan setting environment.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Pengaturan Prompt System AI
                    </CardTitle>
                    <CardDescription>
                        Sesuaikan kerangka dan persona asisten cerdas saat menghasilkan materi kursus.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="prompt_content">Prompt Generasi Deskripsi Kursus</Label>
                        <Textarea
                            id="prompt_content"
                            rows={3}
                            placeholder="Contoh: You are an expert LMS content creator..."
                            value={formData['PROMPT_CONTENT_GENERATION']}
                            onChange={(e) => handleChange('PROMPT_CONTENT_GENERATION', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prompt_quiz">Prompt Generasi Soal Kuis Base JSON</Label>
                        <Textarea
                            id="prompt_quiz"
                            rows={3}
                            placeholder="Contoh: You are an expert educational assessor. Generate MCQs in JSON format..."
                            value={formData['PROMPT_QUIZ_GENERATION']}
                            onChange={(e) => handleChange('PROMPT_QUIZ_GENERATION', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prompt_grading">Prompt Koreksi Otomatis Essay (AI Evaluator)</Label>
                        <Textarea
                            id="prompt_grading"
                            rows={3}
                            placeholder="Contoh: You are a structural teacher grading essay. Output JSON with score & feedback..."
                            value={formData['PROMPT_ESSAY_GRADING']}
                            onChange={(e) => handleChange('PROMPT_ESSAY_GRADING', e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 py-4 px-6 border-t flex justify-end">
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Perubahan
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
