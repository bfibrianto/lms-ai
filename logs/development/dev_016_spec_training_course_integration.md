# DEVELOPMENT LOG
**Target Spec:** 016_spec_training_course_integration.md
**Date:** 2026-03-09 08:05
**Status:** Completed

## 1. Implementation Summary
Telah diimplementasikan fitur penautan materi kursus (prerequisite) ke dalam Pelatihan. Modul ini memungkinkan admin dan HR menautkan referensi kursus ke sebuah kegiatan Pelatihan beserta tenggat waktu akses (dalam hari). Saat pengguna baru mendaftar atau sistem admin melakukan tautan, seluruh peserta aktif otomatis didaftarkan sementara (*temporary enrollment*) ke kursus tersebut dengan atribut `isTemporary` bernilai `true` dan `expiresAt` terhitung kalender. 

Pada bagian Player (`/portal/my-courses/[courseId]`), setiap kali lesson dimuat, router melakukan check kadaluwarsa. Jika `expiresAt` telah terlewati, pengguna otomatis dicegah dan menerima UI layaknya layar Acces Denied (Masa Akses Kedaluwarsa). Terdapat label (badge) berwarna yang menunjukkan masa berlaku di My Courses list.

## 2. Files Created/Modified
- `codes/prisma/schema.prisma` (Menambahkan `TrainingCourse` dan field temporary di `Enrollment`)
- `codes/src/lib/actions/trainings.ts` (API untuk mengelola getLinkedCourses dan sinkronisasi auto-enrollment `linkCoursesToTraining`)
- `codes/src/lib/actions/orders.ts` (Meng-update autoEnrollment untuk training dari order checkouts yang sekarang menyertakan loop course tautan)
- `codes/src/components/backoffice/trainings/linked-courses-tab.tsx` (Sebuah client form builder beserta selection list untu memilih varian courses yg ada.)
- `codes/src/app/(backoffice)/backoffice/trainings/[id]/page.tsx` (Re-structured detail wrapper page to Shadcn Tabs including Info, Peserta, and Materi Pendukung tab)
- `codes/src/app/(portal)/portal/my-courses/[courseId]/page.tsx` (Enforcement access dan info header alert box terkait expiredAt)
- `codes/src/components/portal/courses/my-courses-list.tsx` (Tampilan badge tenggat kedaluwarsa pada list.)
- `codes/src/lib/actions/enrollments.ts` & `types/enrollments.ts` (Ditambahkan eksposur API select `isTemporary` dan `expiresAt`.)

## 3. Technical Notes
Testing bisa dipastikan dengan membuat sebuah Training baru lalu pergi ke tab Linked Courses dan menset minimal 1 hari expires dan memastikan table enrollments database terupdate. Secara frontend bisa merubah database langsung di kolom date untuk mengetes expirenya portal viewer.
