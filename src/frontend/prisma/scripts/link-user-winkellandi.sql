-- =============================================================================
-- Cria/atualiza usuário winkellandi123@gmail.com e vincula TODAS as credenciais.
-- Senha mestra: mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3?
--
-- IMPORTANTE: mantém o encryptionSalt do usuário que já possui credenciais,
-- para que as senhas criptografadas continuem legíveis após o login.
-- Execute no SQL Editor do Neon (ou: psql $DATABASE_URL -f este arquivo)
-- =============================================================================

BEGIN;

DO $$
DECLARE
  v_user_id       TEXT := 'a1000000-0000-4000-8000-000000000001';
  v_email         TEXT := 'winkellandi123@gmail.com';
  v_display_name  TEXT := 'Winkellandi';
  v_pwd_hash      TEXT := '$2a$12$TlVGcG551/h8OtF0cEQzZ.Dr8ot6A.03W8.5uFKIPuKrcS.J2aC66';
  v_salt          TEXT;
  v_timeout       INT;
  v_theme         "Theme";
  v_accent        TEXT;
BEGIN
  -- Salt e preferências do usuário que já detém credenciais (ou primeiro usuário)
  SELECT u."encryptionSalt", u."sessionTimeout", u."theme", u."accentColor"
  INTO v_salt, v_timeout, v_theme, v_accent
  FROM "User" u
  WHERE u.id IN (SELECT DISTINCT "userId" FROM "Credential")
  ORDER BY u."createdAt" ASC
  LIMIT 1;

  IF v_salt IS NULL THEN
    SELECT u."encryptionSalt", u."sessionTimeout", u."theme", u."accentColor"
    INTO v_salt, v_timeout, v_theme, v_accent
    FROM "User" u
    ORDER BY u."createdAt" ASC
    LIMIT 1;
  END IF;

  IF v_salt IS NULL THEN
    v_salt := 'credentials-vault-seed-salt-2026';
    v_timeout := 15;
    v_theme := 'SYSTEM';
    v_accent := 'blue';
  END IF;

  -- Libera o email se estiver em outra conta
  UPDATE "User"
  SET "email" = 'archived-' || "id" || '@vault.local',
      "updatedAt" = NOW()
  WHERE "email" = v_email
    AND "id" <> v_user_id;

  INSERT INTO "User" (
    "id",
    "email",
    "displayName",
    "masterPasswordHash",
    "encryptionSalt",
    "sessionTimeout",
    "theme",
    "accentColor",
    "createdAt",
    "updatedAt"
  ) VALUES (
    v_user_id,
    v_email,
    v_display_name,
    v_pwd_hash,
    v_salt,
    COALESCE(v_timeout, 15),
    COALESCE(v_theme, 'SYSTEM'::"Theme"),
    COALESCE(v_accent, 'blue'),
    NOW(),
    NOW()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "email" = EXCLUDED."email",
    "displayName" = EXCLUDED."displayName",
    "masterPasswordHash" = EXCLUDED."masterPasswordHash",
    "encryptionSalt" = EXCLUDED."encryptionSalt",
    "sessionTimeout" = EXCLUDED."sessionTimeout",
    "theme" = EXCLUDED."theme",
    "accentColor" = EXCLUDED."accentColor",
    "updatedAt" = NOW();

  -- Garante unicidade por email (caso conflito em id diferente)
  UPDATE "User"
  SET
    "email" = v_email,
    "displayName" = v_display_name,
    "masterPasswordHash" = v_pwd_hash,
    "encryptionSalt" = v_salt,
    "sessionTimeout" = COALESCE(v_timeout, 15),
    "theme" = COALESCE(v_theme, 'SYSTEM'::"Theme"),
    "accentColor" = COALESCE(v_accent, 'blue'),
    "updatedAt" = NOW()
  WHERE "id" = v_user_id;

  -- Vincula todas as credenciais a este usuário
  UPDATE "Credential"
  SET "userId" = v_user_id,
      "updatedAt" = NOW();

  RAISE NOTICE 'Usuário % (id: %) — % credencial(is) vinculada(s). Salt: %',
    v_email, v_user_id,
    (SELECT COUNT(*)::INT FROM "Credential" WHERE "userId" = v_user_id),
    v_salt;
END $$;

COMMIT;

-- Conferência
SELECT
  u."id",
  u."email",
  u."displayName",
  u."encryptionSalt",
  (SELECT COUNT(*) FROM "Credential" c WHERE c."userId" = u."id") AS credenciais
FROM "User" u
WHERE u."email" = 'winkellandi123@gmail.com';
