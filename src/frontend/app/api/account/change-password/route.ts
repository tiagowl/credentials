import { NextResponse } from 'next/server';
import { changeMasterPassword } from '@/services/auth.service';
import { changeMasterPasswordSchema } from '@/lib/validators/schemas';
import { requireSession, applySessionCookie } from '@/lib/session';
import { handleApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { vaultKey, userId } = await requireSession();
    const body = await request.json();
    const parsed = changeMasterPasswordSchema.parse(body);
    const result = await changeMasterPassword(
      userId,
      parsed.currentPassword,
      parsed.newPassword,
      vaultKey
    );
    const response = NextResponse.json({ success: result.success });
    applySessionCookie(response, result.payload);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
