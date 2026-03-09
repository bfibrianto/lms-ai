# FIXING LOG
**Target Spec:** 017
**Date:** 2026-03-09 09:30
**Fix ID:** mandatory_assignment_edit_action

## 1. Issue Description
Berdasarkan request user, fitur penugasan sebelumnya kurang menyediakan _action_ untuk mengedit data penugasan yang sudah dibuat. HR perlu bisa mengubah parameter temporal penugasan seperti tanggal mulai (`startDate`) dan batas waktu penyelesaian (`dueDate`).

## 2. Root Cause Analysis
Pada implementasi sebelumnya di tahap 1 (pembuatan awal Assignment), fitur Edit (Update Action) dilewatkan. UI halaman Detail Penugasan hanya memiliki opsi "Lihat Modul", `_count` peserta, progress metrik, dan tombol Navigasi kembali tanpa action untuk mengedit data tenggat/tanggal mulai untuk diteruskan ke proses update sinkronisasi Enrollments karyawan target. 

## 3. Fix Implementation
Perbaikan (Penambahan Fitur) yang dilakukan meliputi:
- **`src/lib/actions/assignments.ts`**: Menambahkan *server action* baru `updateAssignmentDates(id, startDate, dueDate)`. Action ini tidak hanya mengupdate record `Assignment` secara utama, namun mengekstrak seluruh member yang ditugaskan dan secara massal *(updateMany)* melakukan update properti `startDate` dan `dueDate` pada tabel anak yang berkorespondensi yakni `Enrollment`, `TrainingRegistration`, atau `PathEnrollment` bergantung pada tipe (COURSE, TRAINING, atau LEARNING_PATH). 
- **`src/app/(backoffice)/backoffice/assignments/[id]/edit-assignment-dialog.tsx`**: Mengembangkan komponen antarmuka Modal dialog interaktif (Shadcn Dialog) yang bisa berjalan sebagai Client Component untuk menyertakan UI form pengisian Update _Start Date_ dan _Due Date_.
- **`src/app/(backoffice)/backoffice/assignments/[id]/page.tsx`**: Menempatkan *button trigger* komponen `<EditAssignmentDialog />` tersebut di dalam Header Action Detail Penugasan disamping tombol "Lihat Modul".

## 4. Verification
- Verifikasi logika *server action* memastikan tidak membypass guard role `requireAdmin()`.
- Form modal client side memvalidasi proteksi agar *Start Date* tidak boleh lebih besar (melebihi) *Due Date*.
- Proses _type-checking_ validasi statis Typescript proyek menggunakan `npx tsc --noEmit` telah lulus 100% tanpa kendala *binding typescript* dengan Prisma, men-sertifikasi bahwa update code ini *safe*.
