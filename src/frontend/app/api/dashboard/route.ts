import { requireSession } from '@/lib/session';
import { getDashboardStats } from '@/services/health.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function GET() {
  try {
    const { vaultKey } = await requireSession();
    const stats = await getDashboardStats(vaultKey);
    return apiSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
