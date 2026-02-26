'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateContentAction } from '@/lib/actions/ai';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface GenerateContentButtonProps {
    onSuccess: (text: string) => void;
    title?: string;
    context?: string;
    className?: string;
}

export function GenerateContentButton({ onSuccess, title = 'Generate dengan AI', context, className }: GenerateContentButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error('Masukkan prompt atau instruksi.');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await generateContentAction(prompt, context);
            if (res.success && res.data) {
                onSuccess(res.data);
                setIsOpen(false);
                setPrompt('');
                toast.success('Berhasil di-generate oleh AI.');
            } else {
                toast.error(res.error || 'Gagal menghasilkan konten.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm" type="button" className={className}>
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    {title}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Minta Bantuan AI</DialogTitle>
                    <DialogDescription>
                        Masukkan topik atau instruksi, biarkan AI menyusun bahan materi yang menarik untuk Anda.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="Contoh: Buatkan deskripsi kursus menarik sepanjang 2 paragraf tentang Dasar-dasar React Hooks..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
                        Batal
                    </Button>
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Generate Sekarang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
