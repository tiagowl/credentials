import { NextResponse } from 'next/server';
import { login } from '@/services/auth.service';
import { loginSchema } from '@/lib/validators/schemas';
import { handleApiError, AppError } from '@/lib/api-error';
import { applySessionCookie } from '@/lib/session';
import {
  checkRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
  getClientIp,
} from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      throw new AppError(
        'RATE_LIMITED',
        `Muitas tentativas. Tente em ${limit.retryAfter}s`,
        429
      );
    }

    const body = await request.json();
    const parsed = loginSchema.parse(body);
    const result = await login(parsed.email.trim(), parsed.password);
    clearLoginAttempts(ip);
    const response = NextResponse.json({ success: result.success });
    applySessionCookie(response, result.payload);
    return response;
  } catch (error) {
    if (error instanceof AppError && error.code === 'UNAUTHORIZED') {
      recordFailedLogin(getClientIp(request));
    }
    return handleApiError(error);
  }
}
