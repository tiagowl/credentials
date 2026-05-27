import { generatePassword } from '@/lib/crypto';
import { calculatePasswordStrength } from '@/lib/password-strength';
import { apiSuccess, handleApiError } from '@/lib/api-error';
import { requireSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const length = parseInt(searchParams.get('length') ?? '16', 10);
    const symbols = searchParams.get('symbols') !== 'false';
    const password = generatePassword(Math.min(32, Math.max(12, length)), symbols);
    const strength = calculatePasswordStrength(password);
    return apiSuccess({ password, strength });
  } catch (error) {
    return handleApiError(error);
  }
}
