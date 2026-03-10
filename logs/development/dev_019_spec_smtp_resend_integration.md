# DEVELOPMENT LOG
**Target Spec:** 019_spec_smtp_resend_integration.md
**Date:** 2026-03-09 14:18
**Status:** Completed

## 1. Implementation Summary
Fungsi `sendEmail` di `src/lib/email.ts` telah di-refactor sepenuhnya untuk menggunakan pustaka `nodemailer`. Sekarang fungsi tersebut membaca kredensial dari *environment variable* (seperti `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, dan `EMAIL_FROM`) untuk melakukan *handshake* otentikasi SMTP dengan platform Resend. 

Konfigurasi _port_ dinamis, namun secara _default_ tersambung ke port 465 (mengaktifkan mode `secure: true`). Mekanisme _error handling_ disediakan, merekam *error* ke *console* bila terjadi permasalahan otentikasi atau interupsi SMTP, sehingga proses lainnya (misal submit _form_) tidak terkena _crash_ / 500 error. Fungsi *MOCK* (mencetak output _dummy_ ke _console_) hanya dipertahankan bila aplikasi berjalan di mode *development* dan *property* `EMAIL_HOST` absen dari konfigurasi `.env`. 

## 2. Files Created/Modified
- `codes/package.json` (Menambahkan dependensi `nodemailer` dan `@types/nodemailer` untuk tipe data)
- `codes/src/lib/email.ts` (Menghapus kode *mock* awal, menggantikannya dengan integrasi SMTP *Nodemailer*)
- `codes/src/__tests__/lib/email.test.ts` (Unit test, menggunakan `vitest` via fungsi *mocking* internal pada *createTransport*)

## 3. Technical Notes
Kredensial spesifik pada `.env` kini sudah harus didaftarkan di portal Vercel (untuk lingkungan tahap _Production_ maupun *Preview*). Seluruh modul yang memanggil `sendEmail` di kode produksi kini telah otomatis memakai sirkuit Resend bila dikonfigurasi menggunakan prefiks `EMAIL_`.
