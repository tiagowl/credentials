/**
 * Corrige o hash bcrypt da senha mestra (PowerShell corrompeu $Wr4 na geração anterior).
 * Senha correta: mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3?
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MASTER_PASSWORD = 'mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3?';
const EMAIL = 'winkellandi123@gmail.com';

const prisma = new PrismaClient();

const hash = await bcrypt.hash(MASTER_PASSWORD, 12);

await prisma.user.update({
  where: { email: EMAIL },
  data: { masterPasswordHash: hash },
});

const ok = await bcrypt.compare(MASTER_PASSWORD, hash);
console.log('Hash atualizado. Verificação bcrypt:', ok);

// Atualiza o SQL estático para futuras execuções
const sqlPath = path.join(__dirname, 'link-user-winkellandi.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');
sql = sql.replace(
  /v_pwd_hash\s+TEXT := '[^']*';/,
  `v_pwd_hash      TEXT := '${hash}';`
);
fs.writeFileSync(sqlPath, sql);
console.log('link-user-winkellandi.sql atualizado com hash correto.');

await prisma.$disconnect();
