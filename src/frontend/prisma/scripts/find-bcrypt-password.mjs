import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const hash = (
  await prisma.user.findUnique({ where: { email: 'winkellandi123@gmail.com' } })
).masterPasswordHash;

const candidates = [
  'mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3?',
  'Master123!',
  'mV9#Qx2!Lt7@Nz8*Hp1^Dc6&Ka3?', // PowerShell may strip $Wr4
];

for (const p of candidates) {
  console.log(JSON.stringify(p), await bcrypt.compare(p, hash));
}

await prisma.$disconnect();
