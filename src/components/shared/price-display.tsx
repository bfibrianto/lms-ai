import { Badge } from '@/components/ui/badge'
import { formatCurrency, getDiscountPercent } from '@/lib/utils/format-currency'

interface PriceDisplayProps {
    price: number
    promoPrice?: number | null
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({
    price,
    promoPrice,
    className = '',
    size = 'md',
}: PriceDisplayProps) {
    const isFree = (promoPrice != null ? promoPrice : price) === 0
    const hasPromo = promoPrice != null && promoPrice < price

    const textSize = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }[size]

    const strikeSize = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }[size]

    if (isFree) {
        return (
            <Badge
                variant="secondary"
                className={`bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ${className}`}
            >
                Gratis
            </Badge>
        )
    }

    if (hasPromo) {
        const discount = getDiscountPercent(price, promoPrice)
        return (
            <div className={`flex flex-wrap items-center gap-2 ${className}`}>
                <span className={`${strikeSize} text-muted-foreground line-through`}>
                    {formatCurrency(price)}
                </span>
                <span className={`${textSize} font-semibold`}>
                    {formatCurrency(promoPrice)}
                </span>
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    -{discount}%
                </Badge>
            </div>
        )
    }

    return (
        <span className={`${textSize} font-semibold ${className}`}>
            {formatCurrency(price)}
        </span>
    )
}
