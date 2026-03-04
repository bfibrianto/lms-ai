'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getProviderConfig } from '@/lib/ai-providers';
import {
    saveAiProvider,
    activateAiProvider,
    testAiConnection,
    revealApiKey,
    deleteAiProvider,
    AiProviderView
} from '@/lib/actions/ai-providers';

interface AiProviderCardProps {
    providerId: string;
    config: AiProviderView | undefined;
}

export function AiProviderCard({ providerId, config }: AiProviderCardProps) {
    const providerMeta = getProviderConfig(providerId);
    if (!providerMeta) return null;

    const [apiKey, setApiKey] = useState(config?.maskedApiKey || '');
    const [isApiKeyModified, setIsApiKeyModified] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [model, setModel] = useState(config?.model || providerMeta.models[0].id);

    const [isPending, startTransition] = useTransition();
    const [isTesting, setIsTesting] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);

    const isConfigured = !!config;
    const isActive = config?.isActive || false;

    const handleSave = () => {
        if (!apiKey) {
            toast.error('API Key diperlukan.');
            return;
        }

        startTransition(async () => {
            // If the key wasn't modified and it's masked, don't send the masked string as the new key
            let keyToSave = apiKey;
            if (!isApiKeyModified && config?.maskedApiKey === apiKey) {
                // To save changes to model without re-entering the key, we need the actual key.
                // However, our action requries a plaintext key. 
                // A better approach is to only require API key on new setup or explicit change.
                const res = await revealApiKey(providerId);
                if (res.success && res.key) {
                    keyToSave = res.key;
                } else {
                    toast.error('Tidak dapat memuat API key yang tersimpan.');
                    return;
                }
            }

            const res = await saveAiProvider({
                provider: providerId,
                apiKey: keyToSave,
                model
            });

            if (res.success) {
                toast.success(`${providerMeta.label} berhasil disimpan.`);
                setIsApiKeyModified(false);
                // Reload component state if masked key changes
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleTestConnection = () => {
        setIsTesting(true);
        startTransition(async () => {
            const res = await testAiConnection(providerId);
            setIsTesting(false);
            if (res.success) {
                toast.success(`Koneksi sukses! (${res.latency}ms)`);
            } else {
                toast.error(res.error || 'Koneksi gagal.');
            }
        });
    };

    const handleActivate = () => {
        startTransition(async () => {
            const res = await activateAiProvider(providerId);
            if (res.success) {
                toast.success(`${providerMeta.label} diaktifkan sebagai default.`);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleDelete = () => {
        if (!process.browser) return; // Prevent SSR errors
        if (confirm(`Yakin ingin menghapus konfigurasi ${providerMeta.label}?`)) {
            startTransition(async () => {
                const res = await deleteAiProvider(providerId);
                if (res.success) {
                    toast.success(`Konfigurasi dihapus.`);
                    setApiKey('');
                    setModel(providerMeta.models[0].id);
                    setIsApiKeyModified(false);
                } else {
                    toast.error(res.error);
                }
            });
        }
    };

    const handleRevealKey = async () => {
        if (showKey) {
            setShowKey(false);
            if (!isApiKeyModified) setApiKey(config?.maskedApiKey || '');
            return;
        }

        setIsRevealing(true);
        const res = await revealApiKey(providerId);
        setIsRevealing(false);

        if (res.success && res.key) {
            setApiKey(res.key);
            setShowKey(true);
            setIsApiKeyModified(false);
        } else {
            toast.error(res.error || 'Gagal menampilkan API Key.');
        }
    };

    return (
        <Card className={`flex flex-col h-full transition-colors ${isActive ? 'border-primary ring-1 ring-primary' : isConfigured ? '' : 'border-dashed'}`}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-xl">{providerMeta.icon}</span>
                        {providerMeta.label}
                    </CardTitle>
                    {isActive && <Badge variant="default" className="bg-green-600 hover:bg-green-700">ACTIVE</Badge>}
                    {(!isActive && isConfigured) && <Badge variant="secondary">Configured</Badge>}
                </div>
                <CardDescription>
                    <a href={providerMeta.docsUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline underline-offset-4">
                        Dapatkan API Key ↗
                    </a>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                    <Label htmlFor={`model-${providerId}`}>Model</Label>
                    <Select value={model} onValueChange={setModel} disabled={isPending}>
                        <SelectTrigger id={`model-${providerId}`}>
                            <SelectValue placeholder="Pilih Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {providerMeta.models.map(m => (
                                <SelectItem key={m.id} value={m.id}>
                                    <div className="flex flex-col">
                                        <span>{m.label}</span>
                                        <span className="text-xs text-muted-foreground">{m.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`apikey-${providerId}`}>API Key</Label>
                    <div className="relative">
                        <Input
                            id={`apikey-${providerId}`}
                            type={showKey || isApiKeyModified ? "text" : "password"}
                            placeholder={providerMeta.keyPlaceholder}
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setIsApiKeyModified(true);
                            }}
                            disabled={isPending || isRevealing}
                            className="pr-10"
                        />
                        {isConfigured && !isApiKeyModified && (
                            <button
                                type="button"
                                onClick={handleRevealKey}
                                disabled={isRevealing || isPending}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {isRevealing ? <Loader2 className="h-4 w-4 animate-spin" /> : showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-2 bg-muted/20 border-t rounded-b-xl">
                <div className="flex w-full gap-2">
                    {isConfigured ? (
                        <>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleTestConnection}
                                disabled={isPending || isTesting}
                            >
                                {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                Test
                            </Button>
                            {!isActive ? (
                                <Button
                                    className="flex-1"
                                    onClick={handleActivate}
                                    disabled={isPending}
                                >
                                    Aktifkan
                                </Button>
                            ) : (
                                <Button
                                    className="flex-1"
                                    disabled
                                >
                                    Aktif ✓
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handleSave}
                            disabled={isPending || !apiKey}
                        >
                            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Simpan Konfigurasi
                        </Button>
                    )}
                </div>

                {isConfigured && (
                    <div className="flex w-full gap-2 justify-between mt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={handleSave}
                            disabled={!isApiKeyModified && config.model === model || isPending}
                        >
                            Update
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2 text-destructive hover:text-destructive/90"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
