-- Renomeia VaultConfig para User (contas individuais)
ALTER TABLE "VaultConfig" RENAME TO "User";

-- Emails vazios de instalações antigas recebem placeholder único
UPDATE "User"
SET "email" = 'legacy-' || "id" || '@vault.local'
WHERE "email" IS NULL;

ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- Credenciais pertencem a um usuário
ALTER TABLE "Credential" ADD COLUMN "userId" TEXT;

UPDATE "Credential"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

ALTER TABLE "Credential" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");
