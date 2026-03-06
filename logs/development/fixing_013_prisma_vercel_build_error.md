# FIXING LOG
**Target Spec:** 013
**Date:** 2026-03-06 16:15
**Fix ID:** employee_prisma_vercel_build_error

## 1. Issue Description
User melaporkan error build di Vercel setelah implementasi fitur Employee Management. Error message: `Type error: Module '"@prisma/client"' has no exported member 'Role'.` di file `src/lib/actions/employees.ts:7`.

## 2. Root Cause Analysis
Proyek ini menggenerate Prisma Client ke direktori custom (`@/generated/prisma/client`), bukan node_modules bawaan (`@prisma/client`), karena penyesuaian Edge runtime atau konfigurasi spesifik dari proyek Next.js Turbopack ini. Developer sebelumnya mengimport `Role` memakai default path `@prisma/client`, yang menyebabkan TypeScript type checker (terutama di environment Vercel yang lebih ketat atau memiliki cache module berbeda) gagal menemukan definisi `Role` saat `pnpm build`.

## 3. Fix Implementation
Mengubah baris import di `src/lib/actions/employees.ts` dari:
`import { Role } from '@prisma/client'`
menjadi:
`import { Role } from '@/generated/prisma/client'`

## 4. Verification
Menjalankan `pnpm build` secara lokal dan build berhasil menyelesaikan kompilasi TypeScript (Exit code: 0).
