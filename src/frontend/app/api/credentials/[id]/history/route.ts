import { requireSession } from '@/lib/session';
import { getPasswordHistory } from '@/services/credential.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireSession();
    const history = await getPasswordHistory(params.id);
    return apiSuccess(
      history.map((h) => ({
        id: h.id,
        strength: h.strength,
        changedAt: h.changedAt.toISOString(),
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}
