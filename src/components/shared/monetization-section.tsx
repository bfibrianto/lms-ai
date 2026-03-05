'use client'

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VISIBILITY_OPTIONS, visibilityLabels } from '@/lib/validations/monetization'
import type { UseFormReturn } from 'react-hook-form'

interface MonetizationSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>
}

export function MonetizationSection({ form }: MonetizationSectionProps) {
    const visibility = form.watch('visibility')

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-base">Monetisasi & Visibilitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Visibilitas</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    {VISIBILITY_OPTIONS.map((opt) => (
                                        <div key={opt} className="flex items-center space-x-2">
                                            <RadioGroupItem value={opt} id={`vis-${opt}`} />
                                            <Label htmlFor={`vis-${opt}`} className="font-normal cursor-pointer">
                                                {visibilityLabels[opt]}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {visibility === 'PUBLIC' && (
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga Asli (Rp)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="150000"
                                            value={field.value ?? ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === '' ? null : Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>Masukkan 0 untuk konten gratis</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="promoPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Harga Promo (Rp){' '}
                                        <span className="text-muted-foreground font-normal">
                                            (opsional)
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="99000"
                                            value={field.value ?? ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === '' ? null : Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Harus lebih kecil dari harga asli
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
