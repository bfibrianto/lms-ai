# FIXING LOG
**Target Spec:** 010
**Date:** 2026-03-09 11:35
**Fix ID:** course_visibility_update

## 1. Issue Description
User melaporkan bahwa ketika mengubah Course Internal menjadi Public, perubahannya selalu gagal dan visibilitas selalu kembali menjadi Internal setelah disimpan.

## 2. Root Cause Analysis
Masalah bukan berada pada fungsi penyimpanan (Action `updateCourse`), melainkan pada fungsi pemanggilan data kursus (Action `getCourseById`). Developer sebelumnya lupa menyertakan *select* untuk field `visibility`, `price`, dan `promoPrice` di Prisma query `getCourseById()`.

Akibatnya, ketika form "Edit Info Kursus" di-*render* ulang (baik setelah proses update berhasil tersimpan maupun saat pertama kali dibuka), state `course.visibility` bernilai `undefined`, sehingga form komponen (`course-form.tsx`) secara visual dan *default* kembali menampilkan "Internal". Bila form kemudian kembali ditekan tombol "Simpan Perubahan", nilai bawaan (Internal) itulah yang terkirim ke server, menimpa perubahan sebelumnya.

## 3. Fix Implementation
Saya memodifikasi file `src/lib/actions/courses.ts` pada baris fungsi `getCourseById()`. Saya menambahkan deklarasi atribut monetisasi pada scope `select`:
- `visibility: true`
- `price: true`
- `promoPrice: true`

Saya juga mengubah struktur return-nya untuk mengonversi properti `price` dan `promoPrice` (bawaan tipe data `Decimal` dari Prisma) ke dalam spesifikasi standar (tipe `Number` / `null`) supaya terhindar dari error serialisasi JSON (*Hydration error*).
Tipe data pada `src/types/courses.ts` (yakni `CourseDetail`) juga diperbarui agar merangkum ke-tiga tipe di atas.

## 4. Verification
Mengeksekusi TypeScript compiler dan memastikan proses _build_ berhasil sepenuhnya. Melakukan cross-check *console logging* dari payload dan respon Prisma untuk melihat transisi value Internal ke Public yang saat ini tertangkap oleh form dan backend.
