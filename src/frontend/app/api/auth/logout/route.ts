import { NextResponse } from 'next/server';
import { logout } from '@/services/auth.service';
import { handleApiError } from '@/lib/api-error';
import { clearSessionOnResponse } from '@/lib/session';

export async function POST() {
  try {
    await logout();
    const response = NextResponse.json({ success: true });
    clearSessionOnResponse(response);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
