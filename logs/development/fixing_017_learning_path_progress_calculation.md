# FIXING LOG
**Target Spec:** 017
**Date:** 2026-03-09 10:15
**Fix ID:** learning_path_progress_calculation

## 1. Issue Description
User melaporkan bahwa progress untuk penugasan (Mandatory Assignment) bertipe "Learning Path" masih tidak terupdate dengan benar.

## 2. Root Cause Analysis
Sebelumnya, kalkulasi progress untuk `LEARNING_PATH` di dalam `getAssignmentById` dan `getMyAssignments` (file `src/lib/actions/assignments.ts`) hanya mengecek field `completedAt` dari relasi tabel `PathEnrollment`. Model schema `PathEnrollment` aslinya tidak memiliki field `progress`. 
Sehingga, jika user baru menyelesaikan sebagian kursus di dalam sebuah path, progress penugasannya tetap tertulis 0% di halaman detail penugasan maupun di dashboard User. Progress yang sebenarnya adalah akumulasi kursus-kursus yang diselesaikan (`Course` -> `Enrollment` dengan `courseId` bagian dari `pathId`).

## 3. Fix Implementation
Saya memodifikasi file `src/lib/actions/assignments.ts` pada dua fungsi: `getAssignmentById` (untuk Backoffice Admin) dan `getMyAssignments` (untuk Portal User).
Di dalam percabangan tipe `LEARNING_PATH`:
1. Melakukan _fetching_ `pathCourses` untuk mengetahui daftar kursus (`courseId`) apa saja yang ada di dalam Learning Path terkait.
2. Melakukan _fetching_ seluruh `enrollments` milik user yang sesuai dengan daftar kursus tersebut.
3. Menghitung jumlah kursus dengan status `COMPLETED`.
4. Menghitung presentase progress `Math.round((completedCourses / totalCourses) * 100)`.
5. Nilai dari variabel `realProgress` dan `realStatus` diganti berpedoman pada perhitungan tersebut dan di-sync secara dinamis ke `AssignmentTarget`.

## 4. Verification
- TypeScript build check (`npx tsc --noEmit`) sukses tanpa memunculkan error _type-checking_ maupun validasi relasi Prisma.
- Kalkulasi pembagian kini sejalan dengan fungsionalitas aslinya yang ada di halaman utama Portal Learning Path.
