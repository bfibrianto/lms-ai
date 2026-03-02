# FIXING LOG
**Target Spec:** 14 (Gamifikasi Point System)
**Date:** 2026-02-27 09:59
**Fix ID:** prisma_client_validation

## 1. Issue Description
Terdapat error `PrismaClientValidationError` saat proses SSR SSR untuk Top Nav portal, di mana field `points` tidak dikenali (Unknown field `points`) pada _select statement_ model `User`.

## 2. Root Cause Analysis
Error ini terjadi karena proses server Next.js (`pnpm dev`) masih menahan *cache* dari object asali `PrismaClient` versi lama di dalam memori. Next.js seringkali menyimpan `PrismaClient` ke variable global (`globalThis.prisma`) untuk mencegah habisnya koneksi _pool_ selama Fast Refresh. Saat kita menjalankan `prisma db push` dan `prisma generate` di *background*, kode dan tipe TS yang baru memang sudah di-_generate_ ke dalam folder `src/generated/prisma`, namun _instance_ yang berjalan di RAM *sebelumnya* belum di-muat ulang (tidak ter-refresh secara otomatis).

## 3. Fix Implementation
Perbaikan yang dilakukan adalah di luar modifikasi kode. Kode di `src/app/(portal)/layout.tsx` baris ke-21 sebetulnya sudah benar secara logika (mengakses field baru `points`). Resolusinya hanya men-_terminate_ _instance_ Next.js yang berjalan saat ini (CTRL + C) lalu menyalakan ulangnya (`pnpm dev`) untuk memaksa server meramu (instantiate) ulang `PrismaClient` terbaru yang memuat struktur field `points` dan model `PointHistory`.

## 4. Verification
Setelah developer men-_turn-off_ server dev `pnpm dev` yang telah berjalan selama ±16 jam tadi dan menghidupkannya ulang, buka kembali `/portal/dashboard`, maka error ini akan dipastikan langsung menghilang dan query berjalan dengan aman.
