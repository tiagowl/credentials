import { getAccountProfile, updateAccountProfile } from '@/services/auth.service';
import { profileSchema } from '@/lib/validators/schemas';
import { requireSession } from '@/lib/session';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await requireSession();
    const profile = await getAccountProfile(userId);
    return apiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireSession();
    const body = await request.json();
    const parsed = profileSchema.parse(body);
    const profile = await updateAccountProfile(userId, parsed);
    return apiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
