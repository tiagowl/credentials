import { requireSession } from '@/lib/session';
import { toggleFavorite } from '@/services/credential.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { vaultKey } = await requireSession();
    const credential = await toggleFavorite(params.id, vaultKey);
    return apiSuccess(credential);
  } catch (error) {
    return handleApiError(error);
  }
}
