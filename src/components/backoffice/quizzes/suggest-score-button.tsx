'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { suggestEssayScoreAction } from '@/lib/actions/ai';

interface SuggestScoreButtonProps {
    questionText: string;
    studentAnswer: string;
    maxScore: number;
    onSuccess: (score: number, feedback: string) => void;
}

export function SuggestScoreButton({
    questionText,
    studentAnswer,
    maxScore,
    onSuccess,
}: SuggestScoreButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSuggest = async () => {
        if (!studentAnswer || studentAnswer.trim() === '') {
            toast.error('Peserta tidak memberikan jawaban yang bisa dinilai.');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await suggestEssayScoreAction(questionText, studentAnswer);
            if (res.success && res.data) {
                // AI returns 0-100 scale, we map it to maxScore
                let aiScore = res.data.score || 0;
                let mappedScore = Math.round((aiScore / 100) * maxScore);

                // Ensure within bounds
                if (mappedScore > maxScore) mappedScore = maxScore;
                if (mappedScore < 0) mappedScore = 0;

                onSuccess(mappedScore, res.data.feedback);
                toast.success('Peringkas AI berhasil menyarankan nilai dan feedback.');
            } else {
                toast.error(res.error || 'Gagal menyarankan nilai.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem AI.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleSuggest}
            disabled={isGenerating}
            title="Minta saran AI berdasar rubrik 0-100 poin"
            className="ml-auto"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
            )}
            Suggest AI Score
        </Button>
    );
}
