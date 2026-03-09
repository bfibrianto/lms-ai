# FIXING LOG
**Target Spec:** 017
**Date:** 2026-03-09 09:25
**Fix ID:** mandatory_assignment_sync_dynamic_apis

## 1. Issue Description
User melaporkan dua error terkait:
1. "Detail mandatory assignment belum ada" -> Mengacu pada halaman detail penugasan yang tidak ter-render dengan baik dan menampilkan error/404.
2. Error di terminal Node Next.js: `Route used searchParams.search / params.id. params is a Promise and must be unwrapped with await...`

## 2. Root Cause Analysis
Pada Next.js 15, `params` dan `searchParams` diatur sebagai **Promise**. Saat komponen server mengakses properti tersebut secara sinkron (contoh: `params.id`), Next.js akan melemparkan *Sync Dynamic APIs Error*. Akibatnya, `id` yang di-passing ke fungsi `getAssignmentById` bernilai `undefined`, yang menyebabkan database me-return `null` dan halaman *assignment detail* menembakkan `notFound()` (404 Page Not Exist). Selain itu, detail modul apa yang ditugaskan kepada peserta (tautan ke Course/Training) pada halaman detail belum tersedia.

## 3. Fix Implementation
Perbaikan yang dilakukan meliputi:
- **`src/app/(backoffice)/backoffice/assignments/page.tsx`**: Mengubah signatur fungsi page component untuk merubah tipe parameter `searchParams` menjadi `Promise<{...}>`, dan melakukan *unwrap* menggunakan `await props.searchParams`.
- **`src/app/(backoffice)/backoffice/assignments/[id]/page.tsx`**: Mengubah tipe parameter `params` menjadi `Promise<{id: string}>` dan melakukan *unwrap* dengan `await props.params`. 
- Menambahkan tombol **"Lihat Modul"** (View Item) pada header Detail Penugasan (`[id]/page.tsx`) yang menunjuk ke rute URL dinamis berdasarkan `assignemnt.type` (Courses / Trainings / Learning Paths) untuk menambah kejelasan konteks penugasan.

## 4. Verification
- Verifikasi berhasil memastikan *database lookup* kembali normal dan tidak me-return 404 ketika mengklik Detail.
- Log error `Sync Dynamic APIs` di terminal Node sudah hilang untuk kedua _route_ tersebut.
- *Type-checking* via `npx tsc --noEmit` berhasil lulus.
