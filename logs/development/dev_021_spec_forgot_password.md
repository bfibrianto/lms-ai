# DEVELOPMENT LOG
**Target Spec:** 021_spec_forgot_password.md
**Date:** 2026-03-10 15:00
**Status:** Completed

## 1. Implementation Summary
Fitur Lupa Password (Pemulihan Akun) telah diimplementasikan sepenuhnya secara *full-stack*.
- **Validasi Input:** Skema Zod `ForgotPasswordSchema` (email) dan `ResetPasswordSchema` (password, confirmPassword) dibuat dan diintegrasikan. Format email diawasi dengan ketat, mengkonversi string menjadi *lowercase* dan membuang spasi kosong (*trim*) *sebelum* memverifikasi validitas format email. Hal ini juga mengatasi bug ketidaksengajaan spasi pada pendaftaran pelanggan.
- **Backend (Server Actions):** Fungsi `requestPasswordReset` dan `resetPassword` telah disematkan di `src/lib/actions/auth/reset.ts`. Pembuatan token reset di-generate menggunakan `uuid` dan disimpan di struktur data `VerificationToken` dalam Prisma dengan durasi berlaku 30 menit. Pemanggilan ke `sendEmail` (Resend) diteruskan untuk mengirim email notifikasi ke akun bersangkutan, meminimalkan kemungkinan eksploitasi peretasan dan tidak memberikan peringatan bagi "Email Tak Diketahui" (mencegah *enumeration attack*).
- **Frontend / Antarmuka:** Tersedia halaman formulir terpusat `<AuthLayout>` di `/auth/forgot-password` dan `/auth/reset-password`. *State loading* dikontrol agar tidak ter-submit ganda. Pengoperasian sukses / gagal dianimasikan lewat perubahaan UI yang halus menggunakan Card UI dan komponen Alert, dan terhubung kembali dengan portal Sign In.

## 2. Files Created/Modified
- `codes/src/lib/validations/auth.ts` (Menambahkan skema validasi `ForgotPasswordSchema` dan `ResetPasswordSchema`, serta memperbaiki urutan `trim()` di schema Register)
- `codes/src/__tests__/validations/auth.test.ts` (Memuat *unit testing* memakai *vitest* untuk ketahanan modul validasi Zod *Auth*)
- `codes/src/lib/actions/auth/reset.ts` (Berisi *Server Actions* untuk penulisan Token Verifikasi ke PostgreSQL dan mengeksekusi layanan *nodemailer* Resend API)
- `codes/src/app/auth/forgot-password/page.tsx` (Antarmuka pemintaan token reset berbasis Next.js App Router)
- `codes/src/app/auth/reset-password/page.tsx` (Antarmuka penerimaan token reset dan *submission* password baru)
- `codes/src/app/auth/login/page.tsx` (Modifikasi untuk menambahkan anchor navigasi "Lupa Password?")

## 3. Technical Notes
Fitur memerlukan kredensial integrasi SMTP yang telah diselesaikan di tahapan TASK-023. *Environment variables* mencakup URL app (`APP_URL`) agar *domain* rujukan yang dikirim lewat email dapat menunjuk secara dinamis ke alamat situs (atau Vercel Production Preview Link bila ditugaskan sebagai fallback VERCEL_URL). Token digunakan secara eksotik (sekali pakai langsung dihapus dari *database*).
