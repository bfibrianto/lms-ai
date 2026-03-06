# DEVELOPMENT LOG
**Target Spec:** 013_spec_employee_management.md
**Date:** 2026-03-06 14:18
**Status:** In Progress

## 1. Implementation Summary
Tugas ini fokus mengimplementasikan manajemen karyawan untuk ADMIN dan HR.
- Backend: Modifikasi skema DB (`User` mendapat `nik` dan `joinYear`), membuat endpoint `/api/employees` untuk impor single dan endpoint terpisah atau logic bulk untuk impor file Excel.
- Frontend: Membuat UI di `/backoffice/users/employees` dengan Data Table beserta modal Add Employee (Single) dan Import Excel. Data parsing Excel dilakukan di klien untuk kemudian memposting array object ke server.

## 2. Files Created/Modified
- `codes/prisma/schema.prisma` (Added `nik` and `joinYear` to User)
- `codes/src/app/(backoffice)/backoffice/users/employees/page.tsx` (New page for Employees table)
- `codes/src/app/(backoffice)/backoffice/users/employees/employee-list.tsx` (Data table component)
- `codes/src/app/api/employees/route.ts` (API for creating single employee)
- `codes/src/app/api/employees/bulk/route.ts` (API for bulk import employees)
- `codes/src/lib/validations/employee.ts` (Zod schemas for bulk and single employee)

## 3. Technical Notes
Membutuhkan `xlsx` library untuk processing file excel di sisi client-side (atau server-side jika lebih aman) sebelum submit bulk create.
