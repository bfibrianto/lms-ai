# FIXING LOG
**Target Spec:** N/A (MinIO Storage Setup)
**Date:** 2026-03-02 10:13
**Fix ID:** minio_bucket_initialization

## 1. Issue Description
User gagal melakukan _upload_ file gambar/materi ke server `MinIO` yang baru direlokasi ke remote server (`109.199.120.180`). Masalah ini persis muncul setelah user mengganti _env_ local menjadi _remote_ server.

## 2. Root Cause Analysis
Secara hierarki, MinIO/S3 memerlukan sebuah _Bucket_ yang sudah ter-_provision_ secara eksplisit di environment operasionalnya sebelum sebuah sistem bisa menaruh `PutObject` file ke dalamnya. Saat pergantian dari _local_ ke _remote_, _host_ remote MinIO masih kosong bersi (bucket `lms-media` belum ada). Server kita tidak memiliki utilitas otomatis untuk mengecek dan membuat *bucket* tersebut saat _startup_ aplikasi.

## 3. Fix Implementation
Saya memprogram script Node.js utilitas singkat (`scripts/init-minio.js`) yang menginisasi `S3Client`, menyusun pengecekan ke endpoint Bucket bersangkutan mengenakan `HeadBucketCommand`.
- Bila bernilai statis `404`, maka otomatis bucket dibuat `CreateBucketCommand`.
- Kebijakan _policy_ keamanan baca secara anonim (Public Read `s3:GetObject`) langsung direkatkan (attached) ke dalam _Bucket_ memakai `PutBucketPolicyCommand` agar URL foto kelak bisa diakses secara mulus oleh komponen NextImage UI.

## 4. Verification
Script `node scripts/init-minio.js` sukses dieksekusi, menghasilkan respon log:
```bash
Bucket 'lms-media' does not exist. Creating...
✅ Bucket 'lms-media' created successfully.
✅ Public read policy attached to 'lms-media'.
```
Sekarang proses _uploading_ S3 Presigned URL akan bisa memarkir file tanpa Error 404 dari MinIO.
