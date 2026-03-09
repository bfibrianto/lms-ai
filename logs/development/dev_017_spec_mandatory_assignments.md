# DEVELOPMENT LOG
**Target Spec:** 017_spec_mandatory_assignments.md
**Date:** 2026-03-09 08:31
**Status:** Completed

## 1. Implementation Summary
Tugas ini berhasil membangun fitur Penugasan Wajib (Mandatory assignments) untuk karyawan B2B. Alur ini menggunakan model baru `Assignment` dan `AssignmentTarget` di database untuk melacak koleksi penugasan tingkat tinggi, sekaligus meng-upsert baris di `Enrollment`, `TrainingRegistration`, dan `PathEnrollment` dengan field `isMandatory` dan `dueDate`.
Di sisi Backoffice, telah dibuat Dashboard Penugasan dan Wizard Form 3 Langkah untuk memilih materi, mem-filter/memilih banyak karyawan sekaligus, dan menset waktu tenggat.
Di sisi Portal Karyawan, menu "Tugas Wajib" ditambahkan untuk merangkum penugasan yang wajib dikerjakan. Selain itu, daftar kursus (MyCoursesList) umum kini memunculkan badge "Wajib" dan tenggat penyelesaian. Access Guard telah diterapkan pada delete actions (prevent deletion of assigned items).

## 2. Files Created/Modified
- `codes/prisma/schema.prisma` (Assignment, AssignmentTarget, Enrollment, dsb.)
- `codes/src/lib/actions/assignments.ts` (API master untuk pembuatan tugas massal)
- `codes/src/app/(backoffice)/backoffice/assignments/page.tsx` (Dashboard List Assignment HR)
- `codes/src/app/(backoffice)/backoffice/assignments/new/page.tsx` (Assignment Creation 3-Steps Wizard)
- `codes/src/app/(backoffice)/backoffice/assignments/[id]/page.tsx` (Detail List Target Assignees)
- `codes/src/app/(portal)/portal/assignments/page.tsx` (Portal Hub bagi Karyawan)
- `codes/src/components/portal/courses/my-courses-list.tsx` (UI tambahan Badge WAJIB)
- `codes/src/config/navigation.ts` (Links Menu)

## 3. Technical Notes
Deletion guards pada server actions `deleteCourse`, `deleteTraining`, dan `deleteLearningPath` dipicu dengan mengecek `Assignment.findFirst`.
Upsert logic berjalan di dalam loop per-karyawan saat Create Assignment. Untuk ribuan assignees sekaligus, dimasa depan disarankan memindahkan task ini ke Background Job Queue.
