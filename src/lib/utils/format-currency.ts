/**
 * Format a number as Indonesian Rupiah currency.
 * @param amount - The number to format
 * @returns Formatted string, e.g. "Rp 150.000"
 */
export function formatCurrency(amount: number): string {
    if (amount === 0) return 'Gratis'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Calculate discount percentage between original and promo price.
 */
export function getDiscountPercent(
    price: number,
    promoPrice: number
): number {
    if (price <= 0) return 0
    return Math.round((1 - promoPrice / price) * 100)
}
