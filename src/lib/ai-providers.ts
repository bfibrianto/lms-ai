/**
 * Daftar provider AI yang didukung oleh sistem.
 * Constant ini digunakan untuk merender UI pilihan provider dan model.
 */
export const AI_PROVIDERS = {
    OPENAI: {
        id: 'OPENAI',
        label: 'OpenAI',
        icon: '◎',
        models: [
            { id: 'gpt-4o', label: 'GPT-4o', description: 'Flagship model, fastest and most capable' },
            { id: 'gpt-4o-mini', label: 'GPT-4o mini', description: 'Fast, affordable for everyday tasks' },
            { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Powerful legacy model' },
            { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Legacy fast model' },
        ],
        keyPlaceholder: 'sk-...',
        docsUrl: 'https://platform.openai.com/api-keys',
    },
    ANTHROPIC: {
        id: 'ANTHROPIC',
        label: 'Anthropic Claude',
        icon: '◈',
        models: [
            { id: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet', description: 'Latest, best balance of performance & cost' },
            { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', description: 'Previous flagship model' },
            { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', description: 'Fastest, most affordable' },
            { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', description: 'Most capable for highly complex tasks' },
        ],
        keyPlaceholder: 'sk-ant-...',
        docsUrl: 'https://console.anthropic.com/settings/keys',
    },
    DEEPSEEK: {
        id: 'DEEPSEEK',
        label: 'DeepSeek',
        icon: '◇',
        models: [
            { id: 'deepseek-chat', label: 'DeepSeek Chat (V3)', description: 'General purpose, cost-effective' },
            { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (R1)', description: 'Complex logic and coding tasks' },
        ],
        keyPlaceholder: 'sk-...',
        docsUrl: 'https://platform.deepseek.com/api_keys',
    },
    CUSTOM: {
        id: 'CUSTOM',
        label: 'Custom Provider',
        icon: '⚙️',
        models: [], // Will be populated from database
        keyPlaceholder: 'sk-...',
        docsUrl: '#',
    },
} as const;

export type AiProviderId = keyof typeof AI_PROVIDERS;

export function getProviderConfig(provider: string) {
    if (provider in AI_PROVIDERS) {
        return AI_PROVIDERS[provider as AiProviderId];
    }
    return null;
}
