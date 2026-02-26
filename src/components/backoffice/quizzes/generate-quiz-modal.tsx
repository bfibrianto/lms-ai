'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateQuizAction } from '@/lib/actions/ai';
import { addQuestion } from '@/lib/actions/quizzes';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GenerateQuizModalProps {
    quizId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function GenerateQuizModal({ quizId, isOpen, onOpenChange, onSuccess }: GenerateQuizModalProps) {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [count, setCount] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error('Masukkan topik kuis.');
            return;
        }

        if (count < 1 || count > 20) {
            toast.error('Jumlah soal harus antara 1 dan 20.');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await generateQuizAction(topic, count, context);
            if (res.success && res.data) {
                let successCount = 0;

                // Loop through generated questions and add them sequentially to maintain order and avoid race conditions
                for (const q of res.data) {
                    try {
                        const addRes = await addQuestion(quizId, {
                            type: 'MULTIPLE_CHOICE',
                            text: q.text,
                            points: q.points || 1,
                            options: q.options?.map((opt: any) => ({
                                text: opt.text,
                                isCorrect: opt.isCorrect,
                            })) || [],
                        });
                        if (addRes.success) successCount++;
                    } catch (e) {
                        console.error('Failed to add a generated question:', e);
                    }
                }

                toast.success(`Berhasil menambahkan ${successCount} soal kuis dari AI.`);
                onSuccess();
                onOpenChange(false);
                setTopic('');
                setContext('');
                setCount(5);
            } else {
                toast.error(res.error || 'Gagal menghasilkan soal kuis.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Generate Soal dengan AI</DialogTitle>
                    <DialogDescription>
                        Masukkan topik dan bahan referensi untuk menghasilkan soal pilihan ganda secara otomatis.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="topic">Topik Kuis <span className="text-destructive">*</span></Label>
                        <Input
                            id="topic"
                            placeholder="Contoh: CSS Flexbox dan Grid"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="count">Jumlah Soal</Label>
                        <Input
                            id="count"
                            type="number"
                            min={1}
                            max={20}
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="context">Konteks / Referensi Materi (Opsional)</Label>
                        <Textarea
                            id="context"
                            placeholder="Masukkan teks materi sebagai acuan AI dalam membuat soal yang relevan..."
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
                        Batal
                    </Button>
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate Sekarang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
