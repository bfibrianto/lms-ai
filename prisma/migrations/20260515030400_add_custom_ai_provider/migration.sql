-- AlterTable
ALTER TABLE "ai_providers" ADD COLUMN IF NOT EXISTS "customName" TEXT;
ALTER TABLE "ai_providers" ADD COLUMN IF NOT EXISTS "apiUrl" TEXT;
ALTER TABLE "ai_providers" ADD COLUMN IF NOT EXISTS "models" JSONB;

-- Update comment on provider column
COMMENT ON COLUMN "ai_providers"."provider" IS 'OPENAI | ANTHROPIC | DEEPSEEK | CUSTOM';
