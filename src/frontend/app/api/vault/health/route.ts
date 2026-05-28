import { requireSession } from '@/lib/session';
import { getVaultHealth } from '@/services/health.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function GET() {
  try {
    const { vaultKey, userId } = await requireSession();
    const health = await getVaultHealth(userId, vaultKey);
    return apiSuccess(health);
  } catch (error) {
    return handleApiError(error);
  }
}
