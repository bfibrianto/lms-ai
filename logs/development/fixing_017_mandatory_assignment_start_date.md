# FIXING LOG
**Target Spec:** 017
**Date:** 2026-03-09 08:58
**Fix ID:** mandatory_assignment_start_date

## 1. Issue Description
User meminta untuk menambahkan fitur "tanggal mulai" (start date) untuk tenggat waktu mandatory assignment (penugasan wajib) agar periode penugasan bisa dilacak dari awal tayang hingga batas akhirnya. 

## 2. Root Cause Analysis
Pada implementasi awal TASK-022, atribut pengingat waktu yang ditambahkan hanya `dueDate` (batas akhir penyelesaian). Developer sebelumnya melewatkan kebutuhan untuk mencatat kapan penugasan tersebut secara spesifik dimulai, sehingga mengandalkan tanggal rekaman `createdAt` saja. Diperlukan penambahan eksplisit field `startDate` di DB agar UI dan backend logic terstruktur.

## 3. Fix Implementation
Perbaikan yang dilakukan meliputi:
- **Prisma Schema (`prisma/schema.prisma`)**: Menambahkan field `startDate` tipe `DateTime` (bisa null untuk data historis) pada entity `Enrollment`, `TrainingRegistration`, `PathEnrollment`, dan `Assignment`. Value default untuk Assignment adalah `now()`.
- **Backend API (`src/lib/actions/assignments.ts`)**: Membawa value `startDate` di *server action* `createAssignment` dan men-suntikkannya ke Prisma saat proses `create` assignment maupun `upsert` pada tabel-tabel target *enrollment*. Mengkoreksi linter syntax duplicate properties yang sempat terjadi.
- **Form Backoffice (`src/app/(backoffice)/backoffice/assignments/new/page.tsx`)**: Menambahkan input form HTML5 Date untuk mengisi "Tanggal Mulai", lengkap dengan restriksi minimal dueDate tidak boleh mendahului startDate.
- **Tabel Monitoring Backoffice (`src/app/(backoffice)/backoffice/assignments/page.tsx`)**: Menambahkan kolom baru "Tanggal Mulai" beserta *formatting*-nya.
- **Detail Backoffice UI (`src/app/(backoffice)/backoffice/assignments/[id]/page.tsx`)**: Mengubah kartu highlight "Tenggat Waktu" menjadi "Periode Penugasan" untuk menampilkan rentang startDate - dueDate.
- **Card Portal Karyawan (`src/app/(portal)/portal/assignments/page.tsx`)**: Menambahkan baris teks untuk menampilkan tanggal mulai di kartu visual tugas wajib.

## 4. Verification
- Verifikasi berhasil memastikan *database schema* sudah sinkron via `npx prisma db push`.
- Proses Type-checking menggunakan `npx tsc --noEmit` sudah berhasil lulus 100% tanpa error, membuktikan integrasi tipe data TypeScript yang aman.
- *Testing* manual memverifikasi field input start date berfungsi normal.
