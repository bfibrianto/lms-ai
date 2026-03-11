# DEVELOPMENT LOG
**Target Spec:** 020_spec_email_notification_management.md
**Date:** 2026-03-10 15:30
**Status:** Completed

## 1. Implementation Summary
Fitur *Email Notification Management* (Manajemen Notifikasi Email) telah diimplementasikan sepenuhnya agar Admin bisa dengan bebas menghidupkan dan mematikan fungsi *email blast* otomatis saat event-event kritis (Pesanan Baru, Kelulusan, dll.) terjadi di *platform* LMS AI. Preferensi ini disimpan secara JSON stringified dalam tabel `Setting` milik Prisma PostgreSQL (`key: 'EMAIL_NOTIFICATION_PREFS'`). Semua pemanggilan fungsi pengiriman (SMTP) telah dibalut *(wrapped)* dengan validasi terhadap preferensi tersebut dengan Server Action global `getEmailNotificationPrefs()`, mencakup proses mendaftar kelas reguler (Training Registered), kelulusan materi (Course Completed), pendaftaran pesanan (Order Created/Payment Verified), dan pembuatan penugasan wajib (Mandatory Assignment). Notifikasi *In-App* internal tidak terpaut oleh batasan ini.

## 2. Files Created/Modified
- `codes/src/lib/actions/settings.ts` (Implementasi interaksi database untuk mengambil atau memperbarui entri khusus `EMAIL_NOTIFICATION_PREFS`).
- `codes/src/app/(backoffice)/backoffice/settings/page.tsx` (Antarmuka pemuatan layout tab manajemen Email).
- `codes/src/components/backoffice/settings/email-notification-section.tsx` ([NEW] Komponen interaktif *Toggles* berbasis form React/Shadcn untuk mengakomodasi manipulasi kelima preferensi terpisah beserta state perubahannya).
- `codes/src/lib/actions/enrollments.ts`, `codes/src/lib/actions/certificates.ts`, `codes/src/lib/actions/path-enrollments.ts` (Bungkus *wrap* kondisi pengiriman notifikasi email yang sudah eksis sebelumnya dengan state preferensi).
- `codes/src/lib/actions/orders.ts`, `codes/src/lib/actions/assignments.ts` (Implementasi eksekusi fitur notifikasi email baru yang mengikuti kaidah izin pengaturan secara aman).

## 3. Technical Notes
Admin level HR maupun Super Admin dapat mengubah konfigurasi notifikasi ini. Pengiriman *delay* ditangani dengan pemanggilan asinkron tanpa sinkronisasi ketat di atas eksekusi utama (terutama dalam kasus *loop array* di `createAssignment`). Apabila pengaturan *email preferences* absen (pertama kali dimuat), konfigurasi default akan dikembalikan tanpa memutuskan operasional kode.
