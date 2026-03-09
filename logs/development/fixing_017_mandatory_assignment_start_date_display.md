# FIXING LOG
**Target Spec:** 017
**Date:** 2026-03-09 09:35
**Fix ID:** mandatory_assignment_start_date_display

## 1. Issue Description
Tabel *list* penugasan (Assignments) di halaman Backoffice (Admin & HR) tidak dapat memunculkan data untuk kolom "Tanggal Mulai", meskipun _header_ kolom dan data _database_ sudah tersedia. Akibatnya, baris pada tabel terlihat bergeser (misshaped) karena ketidaksesuaian jumlah Header (`TableHead`) dan Cell (`TableCell`).

## 2. Root Cause Analysis
Pada perbaikan (fixing) "Start Date" yang dilaksanakan sebelumnya, developer sudah menambahkan kolom Header `<TableHead>Tanggal Mulai</TableHead>` di `src/app/(backoffice)/backoffice/assignments/page.tsx`. Namun, saat me-_render_ baris tabel di block `res.data?.assignments.map`, komponen `<TableCell>` untuk memformat dan menampilkan atribut `assignment.startDate` secara tidak sengaja terlewatkan (tidak ditulis kodenya), sehingga menimbulkan mismatch/pergeseran layout kolom pada render UI HTML.

## 3. Fix Implementation
Perbaikan yang dilakukan meliputi:
- **`src/app/(backoffice)/backoffice/assignments/page.tsx`**: Mengubah representasi block HTML _rendering_. Menambahkan blok `<TableCell>` baru tepat di atas `TableCell` "Tenggat Waktu". Blok ini memformat objek `assignment.startDate` menggunakan fungsi `format(new Date(assignment.startDate), 'dd MMM yyyy', ...)` secara serasi dengan format Due Date.
- Konfirmasi properti colSpan pada block fallback "Belum ada penugasan" juga dipastikan sudah valid dengan nilai `7` untuk 7 entitas atribut per baris.

## 4. Verification
- Data "Tanggal Mulai" saat ini sudah muncul dan sejajar tepat berada di bawah kolom yang bersangkutan. 
- Proses kompilasi static type-checking menggunakan `npx tsc --noEmit` sudah berhasil 100% lulus.
- Layout barisan tabel sudah sejajar kembali antara _header_ kolom dan baris _cell_ valuenya.
