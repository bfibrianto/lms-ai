'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Trash2, CheckCircle2, Plus, X } from 'lucide-react';
import {
    saveCustomAiProvider,
    activateAiProvider,
    testAiConnection,
    revealApiKey,
    deleteAiProvider,
    AiProviderView
} from '@/lib/actions/ai-providers';

interface CustomAiProviderCardProps {
    config: AiProviderView | undefined;
}

interface ModelInput {
    id: string;
    label: string;
    description: string;
}

export function CustomAiProviderCard({ config }: CustomAiProviderCardProps) {
    const [customName, setCustomName] = useState(config?.customName || '');
    const [apiUrl, setApiUrl] = useState(config?.apiUrl || '');
    const [apiKey, setApiKey] = useState(config?.maskedApiKey || '');
    const [isApiKeyModified, setIsApiKeyModified] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [models, setModels] = useState<ModelInput[]>(
        config?.models ? (config.models as ModelInput[]) : [{ id: '', label: '', description: '' }]
    );

    const [isPending, startTransition] = useTransition();
    const [isTesting, setIsTesting] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);

    const isConfigured = !!config;
    const isActive = config?.isActive || false;

    const handleAddModel = () => {
        setModels([...models, { id: '', label: '', description: '' }]);
    };

    const handleRemoveModel = (index: number) => {
        if (models.length === 1) {
            toast.error('Minimal harus ada 1 model.');
            return;
        }
        setModels(models.filter((_, i) => i !== index));
    };

    const handleModelChange = (index: number, field: keyof ModelInput, value: string) => {
        const newModels = [...models];
        newModels[index][field] = value;
        setModels(newModels);
    };

    const handleSave = () => {
        if (!customName.trim()) {
            toast.error('Nama provider diperlukan.');
            return;
        }
        if (!apiUrl.trim()) {
            toast.error('API URL diperlukan.');
            return;
        }
        if (!apiKey) {
            toast.error('API Key diperlukan.');
            return;
        }

        // Validate models
        const validModels = models.filter(m => m.id.trim() && m.label.trim());
        if (validModels.length === 0) {
            toast.error('Minimal harus ada 1 model dengan ID dan Label yang valid.');
            return;
        }

        startTransition(async () => {
            let keyToSave = apiKey;
            if (!isApiKeyModified && config?.maskedApiKey === apiKey) {
                const res = await revealApiKey('CUSTOM');
                if (res.success && res.key) {
                    keyToSave = res.key;
                } else {
                    toast.error('Tidak dapat memuat API key yang tersimpan.');
                    return;
                }
            }

            const res = await saveCustomAiProvider({
                customName: customName.trim(),
                apiUrl: apiUrl.trim(),
                apiKey: keyToSave,
                models: validModels,
            });

            if (res.success) {
                toast.success('Custom AI Provider berhasil disimpan.');
                setIsApiKeyModified(false);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleTestConnection = () => {
        setIsTesting(true);
        startTransition(async () => {
            const res = await testAiConnection('CUSTOM');
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
            const res = await activateAiProvider('CUSTOM');
            if (res.success) {
                toast.success('Custom Provider diaktifkan sebagai default.');
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus konfigurasi Custom Provider?')) {
            startTransition(async () => {
                const res = await deleteAiProvider('CUSTOM');
                if (res.success) {
                    toast.success('Konfigurasi dihapus.');
                    setCustomName('');
                    setApiUrl('');
                    setApiKey('');
                    setModels([{ id: '', label: '', description: '' }]);
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
        const res = await revealApiKey('CUSTOM');
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
                        <span className="text-xl">⚙️</span>
                        Custom AI Provider
                    </CardTitle>
                    {isActive && <Badge variant="default" className="bg-green-600 hover:bg-green-700">ACTIVE</Badge>}
                    {(!isActive && isConfigured) && <Badge variant="secondary">Configured</Badge>}
                </div>
                <CardDescription>
                    Konfigurasi custom AI provider dengan OpenAI-compatible API
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 max-h-[600px] overflow-y-auto">
                <div className="space-y-2">
                    <Label htmlFor="custom-name">Nama Provider</Label>
                    <Input
                        id="custom-name"
                        placeholder="e.g., My Custom AI"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        disabled={isPending}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="api-url">API URL</Label>
                    <Input
                        id="api-url"
                        placeholder="https://api.example.com/v1"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        disabled={isPending}
                    />
                    <p className="text-xs text-muted-foreground">Base URL untuk OpenAI-compatible API</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="custom-apikey">API Key</Label>
                    <div className="relative">
                        <Input
                            id="custom-apikey"
                            type={showKey || isApiKeyModified ? "text" : "password"}
                            placeholder="sk-..."
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

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Models</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddModel}
                            disabled={isPending}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Model
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {models.map((model, index) => (
                            <div key={index} className="border rounded-lg p-2 bg-muted/20">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Model {index + 1}</span>
                                    <Input
                                        placeholder="Model ID"
                                        value={model.id}
                                        onChange={(e) => handleModelChange(index, 'id', e.target.value)}
                                        disabled={isPending}
                                        className="text-sm h-8 flex-1"
                                    />
                                    <Input
                                        placeholder="Label"
                                        value={model.label}
                                        onChange={(e) => handleModelChange(index, 'label', e.target.value)}
                                        disabled={isPending}
                                        className="text-sm h-8 flex-1"
                                    />
                                    <Input
                                        placeholder="Description"
                                        value={model.description}
                                        onChange={(e) => handleModelChange(index, 'description', e.target.value)}
                                        disabled={isPending}
                                        className="text-sm h-8 flex-[1.5]"
                                    />
                                    {models.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveModel(index)}
                                            disabled={isPending}
                                            className="h-8 w-8 p-0 flex-shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
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
                            disabled={isPending || !customName || !apiUrl || !apiKey}
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
                            disabled={isPending}
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
