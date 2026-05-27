-- Credentials Vault — Dados de teste (SQL)
-- Senha mestra: Master123!
-- Salt: credentials-vault-seed-salt-2026
-- Gerado por: node prisma/generate-seed-sql.mjs

DELETE FROM "PasswordHistory";
DELETE FROM "Credential";
DELETE FROM "VaultConfig";

INSERT INTO "VaultConfig" ("id", "masterPasswordHash", "encryptionSalt", "sessionTimeout", "theme", "accentColor", "createdAt", "updatedAt") VALUES (
  '00000000-0000-0000-0000-000000000001', '$2b$12$u8lVfvboazk2td10NShw7.nXqZKLMf8ZaSAxVFM6r4pFyzu3Uo3GO', 'credentials-vault-seed-salt-2026', 15, 'SYSTEM'::"Theme", 'blue', NOW(), NOW());

INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000001', 'YouTube', 'tiago.dev', 'tiago@gmail.com', '{"c":"71LQVg7z8c6t6LBtCGIh2HWl","t":"Lx21z9oC64tI+LwCLoGUVA=="}', 'MTAwMDAwMDAtMDAw', 'https://youtube.com', 'STREAMING'::"Category", 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64', true, NULL, NULL, 85, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 85, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000002', 'Facebook', 'tiago.silva', 'tiago.silva@email.com', '{"c":"8ESzVh/itNKv8Lt8","t":"40tunNzxbhXYjw0NiGCrig=="}', 'MTAwMDAwMDAtMDAw', 'https://facebook.com', 'SOCIAL'::"Category", 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64', true, NULL, NULL, 80, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 80, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000003', 'Twitter', '@tiago_dev', 'tiago@twitter.com', '{"c":"hxTAMU+3","t":"5DAdxX52wSzRfUaseV1Lug=="}', 'MTAwMDAwMDAtMDAw', 'https://twitter.com', 'SOCIAL'::"Category", 'https://www.google.com/s2/favicons?domain=twitter.com&sz=64', false, NULL, NULL, 20, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 20, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000004', 'Gmail', 'tiago', 'tiago@gmail.com', '{"c":"8UuzbBbRgdO5+7JvDnci3GWjcJM=","t":"TzpfEa+mxZOXCk2oM4qQAw=="}', 'MTAwMDAwMDAtMDAw', 'https://gmail.com', 'EMAIL'::"Category", 'https://www.google.com/s2/favicons?domain=gmail.com&sz=64', true, NULL, NULL, 90, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 90, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000005', 'Netflix', 'tiago@email.com', 'tiago@email.com', '{"c":"+F7XUhv1osj4+bBpGw==","t":"MfiPD7nhZS98oKw2/RyiaQ=="}', 'MTAwMDAwMDAtMDAw', 'https://netflix.com', 'STREAMING'::"Category", 'https://www.google.com/s2/favicons?domain=netflix.com&sz=64', false, NULL, NULL, 85, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 85, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000006', 'GitHub', 'tiagodev', 'dev@github.com', '{"c":"8U7QRkrlpJL6+7Z8fjMH","t":"SVR7vFoRgmDO6Gim3F5C6Q=="}', 'MTAwMDAwMDAtMDAw', 'https://github.com', 'WORK'::"Category", 'https://www.google.com/s2/favicons?domain=github.com&sz=64', true, NULL, NULL, 90, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 90, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000007', 'Nubank', '123.456.789-00', 'tiago@email.com', '{"c":"+FPXRzrvqpL6+7Z8","t":"X/F4WLhjA/s88NfbSah/5g=="}', 'MTAwMDAwMDAtMDAw', 'https://nubank.com.br', 'BANKING'::"Category", 'https://www.google.com/s2/favicons?domain=nubank.com.br&sz=64', false, '{"c":"7V3RaRvjpMzo86ANcxhTlSSgY5pSLc9MUfDdOwv+2mjUT3cu+Y8aw1mSPSSa","t":"CB7HbqxI7vzjaNth10ErAQ=="}', 'MTAwMDAwMDAtMDAw', 85, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 85, NOW());
INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (
  '10000000-0000-0000-0000-000000000008', 'Spotify', 'tiago_spotify', 'tiago@spotify.com', '{"c":"hxTAMU+3","t":"5DAdxX52wSzRfUaseV1Lug=="}', 'MTAwMDAwMDAtMDAw', 'https://spotify.com', 'STREAMING'::"Category", 'https://www.google.com/s2/favicons?domain=spotify.com&sz=64', false, NULL, NULL, 20, NOW(), NOW());
INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (
  '20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', 20, NOW());