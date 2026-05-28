import { NextResponse } from 'next/server';
import { registerVault } from '@/services/auth.service';
import { registerSchema } from '@/lib/validators/schemas';
import { handleApiError } from '@/lib/api-error';
import { applySessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const result = await registerVault(
      parsed.email,
      parsed.password,
      parsed.displayName
    );
    const response = NextResponse.json({ success: result.success }, { status: 201 });
    applySessionCookie(response, result.payload);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
