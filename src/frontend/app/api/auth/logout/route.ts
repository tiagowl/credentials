import { logout } from '@/services/auth.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function POST() {
  try {
    const result = await logout();
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
