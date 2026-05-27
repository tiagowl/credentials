import { requireSession } from '@/lib/session';
import {
  listCredentialsPaginated,
  createCredential,
} from '@/services/credential.service';
import { createCredentialSchema } from '@/lib/validators/schemas';
import { apiSuccess, handleApiError } from '@/lib/api-error';
import { refreshSessionActivity } from '@/services/auth.service';
import { Category } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { vaultKey } = await requireSession();
    await refreshSessionActivity();

    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') ?? undefined,
      appName: searchParams.get('appName') ?? undefined,
      userEmail: searchParams.get('userEmail') ?? undefined,
      username: searchParams.get('username') ?? undefined,
      email: searchParams.get('email') ?? undefined,
      category: (searchParams.get('category') as Category) || undefined,
      favorite: searchParams.get('favorite') === 'true',
      sort: searchParams.get('sort') ?? undefined,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!, 10)
        : undefined,
      offset: searchParams.get('offset')
        ? parseInt(searchParams.get('offset')!, 10)
        : undefined,
    };

    const credentials = await listCredentialsPaginated(filters, vaultKey);
    return apiSuccess(credentials);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { vaultKey } = await requireSession();
    const body = await request.json();
    const parsed = createCredentialSchema.parse(body);
    const credential = await createCredential(parsed, vaultKey);
    return apiSuccess(credential, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
