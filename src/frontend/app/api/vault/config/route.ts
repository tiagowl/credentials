import { getVaultConfig, updateVaultConfig } from '@/services/auth.service';
import { vaultConfigSchema } from '@/lib/validators/schemas';
import { requireSession } from '@/lib/session';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function GET() {
  try {
    await requireSession();
    const config = await getVaultConfig();
    return apiSuccess(config);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = vaultConfigSchema.parse(body);
    const config = await updateVaultConfig(parsed);
    return apiSuccess(config);
  } catch (error) {
    return handleApiError(error);
  }
}
