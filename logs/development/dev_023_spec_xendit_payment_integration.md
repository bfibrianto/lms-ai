# Dev Log — SPEC-023: Xendit Payment Integration

**Task:** TASK-027  
**Spec:** 023_spec_xendit_payment_integration.md  
**Status:** ready_to_test  
**Date:** 2026-05-05

---

## Summary

Implemented Xendit Payment Gateway integration to replace the manual bank transfer flow. Users are now redirected to a Xendit-hosted invoice page to complete payment. Upon successful payment, the webhook handler auto-enrolls the user and sends an email notification.

---

## Files Modified / Created

### Modified
| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added 4 fields to `model Order`: `xenditInvoiceId`, `xenditInvoiceUrl`, `paymentMethod`, `paymentGateway` |
| `src/lib/actions/orders.ts` | Exported `autoEnroll()` (was private) for use by webhook handler |
| `src/app/(portal)/portal/checkout/[type]/[id]/checkout-form.tsx` | Replaced manual bank transfer flow with Xendit redirect; added new props `existingOrderId` + `existingInvoiceUrl` |
| `src/app/(portal)/portal/checkout/[type]/[id]/page.tsx` | Pass `existingOrderId` and `existingInvoiceUrl` to `CheckoutForm` |

### Created
| File | Purpose |
|------|---------|
| `src/lib/xendit.ts` | Xendit SDK client singleton (`xenditInvoice`) |
| `src/lib/actions/xendit.ts` | `createOrderWithXenditInvoice()`, `getOrderStatus()` server actions |
| `src/app/api/webhooks/xendit/route.ts` | Xendit webhook POST handler — validates token, processes PAID/EXPIRED events |
| `src/app/(portal)/portal/orders/[orderId]/page.tsx` | Order detail page with client-side polling every 3s (max 10 attempts = 30s) |
| `src/components/portal/xendit-payment-button.tsx` | Reusable `XenditPaymentButton` client component |

---

## Database Changes

Ran `pnpm prisma db push` (schema drift existed, bypassed migration history):

```sql
ALTER TABLE "orders"
  ADD COLUMN "xenditInvoiceId" TEXT,
  ADD COLUMN "xenditInvoiceUrl" TEXT,
  ADD COLUMN "paymentMethod" TEXT,
  ADD COLUMN "paymentGateway" TEXT DEFAULT 'MANUAL';
```

---

## Environment Variables Required

Add to `.env`:
```env
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=your_webhook_callback_token
```

Register webhook in Xendit dashboard → Webhook URL:
```
https://<your-domain>/api/webhooks/xendit
```
Events: `invoice.paid`, `invoice.expired`

---

## Flow Description

### Paid Item Checkout
1. User clicks **Bayar Sekarang** on checkout page
2. `createOrderWithXenditInvoice(itemType, itemId)` is called:
   - Fetches item details
   - Creates `Order` record (status: `PENDING`, paymentGateway: `XENDIT`)
   - Calls Xendit API to create Invoice (`external_id: ORDER-{orderId}`)
   - Saves `xenditInvoiceId` + `xenditInvoiceUrl` to order
   - Returns `{ invoiceUrl, orderId }`
3. Client redirects to `invoiceUrl` (Xendit hosted page)
4. User completes payment on Xendit
5. Xendit calls `POST /api/webhooks/xendit` with status `PAID`
6. Webhook handler:
   - Validates `x-callback-token`
   - Extracts `orderId` from `external_id`
   - Updates order status → `PAID`, saves `paymentMethod`
   - Calls `autoEnroll(userId, itemType, itemId)`
   - Sends email notification
7. Xendit redirects user to `successRedirectUrl`: `/portal/orders/{orderId}?status=success`
8. Order detail page polls `getOrderStatus()` every 3s until `PAID` is confirmed

### PENDING Re-entry (checkout page visited again)
- If order is PENDING and `xenditInvoiceUrl` exists → show **Bayar Sekarang** button to re-open Xendit page
- If `xenditInvoiceUrl` is null → show generic "pesanan aktif" message

### Free Item
- Unchanged — uses `createOrder(formData)` with direct auto-enroll

---

## Notes

- `autoEnroll` is now exported from `orders.ts` (was internal)
- Webhook is idempotent: skips if `order.status === PAID` already
- Expired invoices → order status set to `CANCELLED`
- `XenditPaymentButton` component available for reuse in order list page or anywhere
