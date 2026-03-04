import { z } from 'zod'

export const VISIBILITY_OPTIONS = ['INTERNAL', 'PUBLIC'] as const

export const visibilityLabels: Record<string, string> = {
    INTERNAL: 'Internal — Hanya karyawan perusahaan',
    PUBLIC: 'Public — Tersedia untuk publik',
}

/**
 * Monetization fields schema — merge into create/edit schemas.
 * When visibility is PUBLIC, price is required.
 */
export const MonetizationFieldsSchema = z.object({
    visibility: z.enum(VISIBILITY_OPTIONS).default('INTERNAL'),
    price: z.preprocess(
        (v) => (v === '' || v == null ? null : Number(v)),
        z.number().min(0, 'Harga tidak boleh negatif').nullable()
    ),
    promoPrice: z.preprocess(
        (v) => (v === '' || v == null ? null : Number(v)),
        z.number().min(0, 'Harga promo tidak boleh negatif').nullable()
    ),
})

/**
 * Superrefine to validate monetization business rules.
 * Use with .superRefine(validateMonetization) on the merged schema.
 */
export function validateMonetization(
    data: { visibility: string; price?: number | null; promoPrice?: number | null },
    ctx: z.RefinementCtx
) {
    if (data.visibility === 'PUBLIC') {
        if (data.price == null) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Harga wajib diisi untuk item Public',
                path: ['price'],
            })
        }
    }
    if (
        data.promoPrice != null &&
        data.price != null &&
        data.promoPrice >= data.price
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Harga promo harus lebih kecil dari harga asli',
            path: ['promoPrice'],
        })
    }
}
