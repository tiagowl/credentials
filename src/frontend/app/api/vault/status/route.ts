import { getVaultStatus } from '@/services/auth.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getVaultStatus();
    return apiSuccess(status);
  } catch (error) {
    return handleApiError(error);
  }
}
