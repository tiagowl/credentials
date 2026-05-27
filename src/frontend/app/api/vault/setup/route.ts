import { setupVault } from '@/services/auth.service';
import { setupSchema } from '@/lib/validators/schemas';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = setupSchema.parse(body);
    const result = await setupVault(parsed.password);
    return apiSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
