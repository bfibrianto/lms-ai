-- CreateEnum for Visibility if not exists
DO $$ BEGIN
 CREATE TYPE "Visibility" AS ENUM ('INTERNAL', 'PUBLIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable courses - add missing columns
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "visibility" "Visibility" NOT NULL DEFAULT 'INTERNAL';
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "price" DECIMAL(12,2);
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "promoPrice" DECIMAL(12,2);

-- AlterTable trainings - add missing columns
ALTER TABLE "trainings" ADD COLUMN IF NOT EXISTS "visibility" "Visibility" NOT NULL DEFAULT 'INTERNAL';
ALTER TABLE "trainings" ADD COLUMN IF NOT EXISTS "price" DECIMAL(12,2);
ALTER TABLE "trainings" ADD COLUMN IF NOT EXISTS "promoPrice" DECIMAL(12,2);

-- AlterTable learning_paths - add missing columns
ALTER TABLE "learning_paths" ADD COLUMN IF NOT EXISTS "visibility" "Visibility" NOT NULL DEFAULT 'INTERNAL';
ALTER TABLE "learning_paths" ADD COLUMN IF NOT EXISTS "price" DECIMAL(12,2);
ALTER TABLE "learning_paths" ADD COLUMN IF NOT EXISTS "promoPrice" DECIMAL(12,2);

-- AlterTable enrollments - add missing columns
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "isTemporary" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "isMandatory" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);

-- AlterTable training_registrations - add missing columns
ALTER TABLE "training_registrations" ADD COLUMN IF NOT EXISTS "isMandatory" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "training_registrations" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "training_registrations" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);

-- AlterTable path_enrollments - add missing columns
ALTER TABLE "path_enrollments" ADD COLUMN IF NOT EXISTS "isMandatory" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "path_enrollments" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "path_enrollments" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);

-- AlterTable questions - add missing columns for FILE_UPLOAD type
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "allowedFileTypes" TEXT;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "maxFileSizeMB" INTEGER;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "maxFileCount" INTEGER DEFAULT 1;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "uploadInstructions" TEXT;

-- AlterTable attempt_answers - add missing column for FILE_UPLOAD type
ALTER TABLE "attempt_answers" ADD COLUMN IF NOT EXISTS "uploadedFiles" JSONB;

-- AlterTable users - add points column if not exists
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "points" INTEGER NOT NULL DEFAULT 0;
