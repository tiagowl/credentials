-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SOCIAL', 'STREAMING', 'EMAIL', 'BANKING', 'WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateTable
CREATE TABLE "VaultConfig" (
    "id" TEXT NOT NULL,
    "masterPasswordHash" TEXT NOT NULL,
    "encryptionSalt" TEXT NOT NULL,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 15,
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "accentColor" TEXT NOT NULL DEFAULT 'blue',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaultConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "passwordEnc" TEXT NOT NULL,
    "passwordIv" TEXT NOT NULL,
    "url" TEXT,
    "category" "Category" NOT NULL DEFAULT 'OTHER',
    "iconUrl" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "customFieldsEnc" TEXT,
    "customFieldsIv" TEXT,
    "passwordStrength" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordHistory" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Credential_appName_idx" ON "Credential"("appName");

-- CreateIndex
CREATE INDEX "Credential_username_idx" ON "Credential"("username");

-- CreateIndex
CREATE INDEX "Credential_email_idx" ON "Credential"("email");

-- CreateIndex
CREATE INDEX "Credential_category_idx" ON "Credential"("category");

-- CreateIndex
CREATE INDEX "Credential_isFavorite_idx" ON "Credential"("isFavorite");

-- CreateIndex
CREATE INDEX "Credential_updatedAt_idx" ON "Credential"("updatedAt");

-- CreateIndex
CREATE INDEX "PasswordHistory_credentialId_idx" ON "PasswordHistory"("credentialId");

-- AddForeignKey
ALTER TABLE "PasswordHistory" ADD CONSTRAINT "PasswordHistory_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;
