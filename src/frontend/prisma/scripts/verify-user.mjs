import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const pwd = 'mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3?';

const user = await prisma.user.findUnique({
  where: { email: 'winkellandi123@gmail.com' },
});
console.log('bcrypt ok:', await bcrypt.compare(pwd, user.masterPasswordHash));
console.log('salt:', user.encryptionSalt);

const users = await prisma.user.findMany({
  select: { id: true, email: true, encryptionSalt: true },
});
console.log('all users:', users);

const byUser = await prisma.credential.groupBy({
  by: ['userId'],
  _count: true,
});
console.log('credentials per user:', byUser);

await prisma.$disconnect();
