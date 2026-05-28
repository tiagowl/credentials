-- AlterTable
ALTER TABLE "VaultConfig" ADD COLUMN "email" TEXT;
ALTER TABLE "VaultConfig" ADD COLUMN "displayName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VaultConfig_email_key" ON "VaultConfig"("email");
