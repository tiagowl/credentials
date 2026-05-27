import { NextResponse } from 'next/server';
import { setupVault } from '@/services/auth.service';
import { setupSchema } from '@/lib/validators/schemas';
import { handleApiError } from '@/lib/api-error';
import { applySessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = setupSchema.parse(body);
    const result = await setupVault(parsed.password);
    const response = NextResponse.json({ success: result.success }, { status: 201 });
    applySessionCookie(response, result.payload);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
