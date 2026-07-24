-- AlterTable
ALTER TABLE "users" ADD COLUMN "nik" TEXT,
ADD COLUMN "joinYear" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");
