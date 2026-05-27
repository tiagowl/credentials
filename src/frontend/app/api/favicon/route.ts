import { getFaviconUrl } from '@/lib/constants';
import { requireSession } from '@/lib/session';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function GET(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const appName = searchParams.get('appName') ?? '';
    const url = searchParams.get('url');
    const iconUrl = getFaviconUrl(appName, url);
    return apiSuccess({ iconUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
