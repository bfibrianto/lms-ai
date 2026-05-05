'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOrderWithXenditInvoice } from '@/lib/actions/xendit'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface XenditPaymentButtonProps {
    itemType: string
    itemId: string
    label?: string
    className?: string
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function XenditPaymentButton({
    itemType,
    itemId,
    label = 'Bayar Sekarang',
    className,
    variant = 'default',
    size = 'default',
}: XenditPaymentButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true)
        const result = await createOrderWithXenditInvoice(itemType, itemId)
        setLoading(false)

        if (!result.success) {
            toast.error(result.error || 'Gagal membuat invoice pembayaran')
            return
        }

        // Redirect to our custom payment page (not Xendit-hosted)
        router.push(`/portal/payment/${result.data.orderId}`)
    }

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            variant={variant}
            size={size}
            className={className}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyiapkan pembayaran...
                </>
            ) : (
                label
            )}
        </Button>
    )
}
