# FIXING LOG
**Target Spec:** 017
**Date:** 2026-03-09 09:40
**Fix ID:** mandatory_assignment_extended_features

## 1. Issue Description
User meminta beberapa poin perbaikan terkait fitur penugasan (Mandatory Assignments):
1. **Tambahkan judul penugasan:** Field opsional, default menggunakan nama modul.
2. **Progress peserta tidak berubah:** Di detail penugasan, progress dan status peserta tidak sinkron dengan progress asli pada tabel *enrollment* padahal peserta sudah menyelesaikan course/training/path.
3. **Tambahkan action hapus & verifikasi:** Pada daftar peserta, sediakan opsi aksi hapus beserta fungsi untuk memverifikasi secara paksa (mark as completed).
4. **Tambahkan detail riwayat belajar peserta:** HR perlu opsi untuk melihat riwayat aktivitas belajar/modul spesifik dari peserta tersebut.

## 2. Root Cause Analysis
1. Pada form pembuatan penugasan (`assignments/new/page.tsx`), kita sebelumnya mengekspektasikan variabel `itemTitle` untuk hanya dirender sebagai teks biasa, belum ada *input field* opsional untuk menyunting/menyematkan custom title.
2. Progress peserta sebelumnya hanya mengandalkan kolom statis `progress` dan `status` dari model tabel `AssignmentTarget` secara sepihak, sehingga tidak tersinkronisasi kembali ketika `Enrollment` aslinya sudah berubah dari sisi karyawan ("stale data problem").
3. Tidak tersedianya UI dropdown Action pada detail penugasan (`ParticipantActions`) menyebabkan tidak ada tombol aksi HR.
4. Riwayat detail progress modul sebelumnya belum memiliki rute (route) *endpoint action* tersendiri untuk menampilkan data spesifik dari relasi riwayat penugasan (`LessonCompletion`).

## 3. Fix Implementation
1. **Opsional Title:** Di `src/app/(backoffice)/backoffice/assignments/new/page.tsx` (Step 3), ditambahkan `<Input id="title"/>` opsional yang nilainya (`itemTitle`) secara default ditarik dari selection step 1. Ini akan dikirimkan ke server action `createAssignment` untuk diinput ke database.
2. **Progress Syncing:** Di dalam `getAssignmentById` (dan `getMyAssignments`) pada `src/lib/actions/assignments.ts`, ditambahkan logika sinkronisasi dinamis yang mem-_fetch_ tabel *real enrollment* (`Enrollment`, `TrainingRegistration`, `PathEnrollment`) sebelum mereturn response ke Frontend. Progress ini kemudian di-update dan ditampilkan on-the-fly (`enrichedAssignees`).
3. **Participant Actions:** Menambahkan *client component* baru `ParticipantActions` dengan 3 opsi: 
   - Hapus Peserta (`removeAssignmentTarget` action): menghapus assignee dari list dan mengeset flag `isMandatory` menjadi false di Enrollment aslinya.
   - Verifikasi Selesai (`verifyAssignmentCompletion` action): meng-update `status` ke 'COMPLETED' dan `progress` ke 100 secara instan di tabel `Enrollment` dan `AssignmentTarget`.
4. **Riwayat Belajar:** Menambahkan fungsi `getAssigneeHistory` di backend untuk melacak detail `LessonCompletion` per course. Pada UI `ParticipantActions`, ditambahkan sub-komponen `<Dialog>` baru yang merender tabel sejarah kapan karyawan menyelesaikan modul tertentu.

## 4. Verification
1. Proses verifikasi *Static Type-Checking* / TypeScript Build melalui `npx tsc --noEmit` berhasil tanpa ada sintaks/prop Error.
2. Component UI Client (`ParticipantActions`) sudah tersisip secara benar pada table `Aksi` di halaman `/assignments/[id]`.
3. Action Menu dropdown sudah divalidasi dengan logika pencegahan yang semestinya (misal: tombol Verifikasi hilang ketika modul sudah berstatus `COMPLETED`).
