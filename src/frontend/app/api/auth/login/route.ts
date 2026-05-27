import { login } from '@/services/auth.service';
import { loginSchema } from '@/lib/validators/schemas';
import { apiSuccess, handleApiError, AppError } from '@/lib/api-error';
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
    const result = await login(parsed.password);
    clearLoginAttempts(ip);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof AppError && error.code === 'UNAUTHORIZED') {
      recordFailedLogin(getClientIp(request));
    }
    return handleApiError(error);
  }
}
