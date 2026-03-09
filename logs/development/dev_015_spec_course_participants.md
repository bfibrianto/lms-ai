# DEVELOPMENT LOG
**Target Spec:** 015_spec_course_participants.md
**Date:** 2026-03-06 16:40
**Status:** Completed

## 1. Implementation Summary
Tugas ini berhasil membangun fitur Pelacakan Progres Peserta di sisi Backoffice:
- Saya menambahkan tab baru "Peserta & Progres" di dalam halaman builder setiap *Course* (`/backoffice/courses/[id]`) untuk memisahkan manajemen materi dengan analitik peserta. Tab ini dibuat memanfaatkan komponen Shadcn UI Tabs.
- Saya membuat API Server Action backend `getCourseParticipants` yang menghitung persentase progres masing-masing peserta terdaftar, dihitung berdasarkan jumlah `completedLessons` dibagi total `lessons`. Data ini dikonsumsi oleh komponen `<CourseParticipantsTab />` yang menampilkan tabel pencarian peserta.
- Saya membuat komponen `<ParticipantDetailSheet />` (sebuah slide-over Shadcn Sheet) dan Server Action `getParticipantDetail` yang memungkinkan HR Admin / Mentor untuk mengklik user tertentu dalam daftar, dan melihat detil histori riwayat Kuis mereka di kursus tersebut. Skor terbaik dari tiap kuis dicatat di sini.

## 2. Files Created/Modified
- `codes/src/app/(backoffice)/backoffice/courses/[id]/page.tsx` (Refactor: Pemisahan antar tab Materi & Peserta)
- `codes/src/lib/actions/courses.ts` (Penambahan `getCourseParticipants`, `getParticipantDetail`)
- `codes/src/types/courses.ts` (Tipe Data Peserta)
- `codes/src/components/backoffice/courses/course-participants-tab.tsx` (Data Table UI List Peserta)
- `codes/src/components/backoffice/courses/participant-detail-sheet.tsx` (Detail histori Assessment Peserta)

## 3. Technical Notes
Fitur progres ini bergantung secara real-time dari relasi tabel `Enrollment` ke `LessonCompletion` untuk metric bar, dan `Enrollment` ke `QuizAttempt` untuk fitur Sheet. Logika ini efisien dan scalable karena tidak ada redudansi state completion di tabel enrollment utama. Namun kedepannya jika jumlah peserta menembus puluhan ribu per kursus, server action `getCourseParticipants` sebaiknya menggunakan pagination.
