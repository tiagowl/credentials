import { requireSession } from '@/lib/session';
import { importVault } from '@/services/export.service';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const { vaultKey } = await requireSession();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as 'merge' | 'replace') ?? 'merge';
    const format = (formData.get('format') as 'json' | 'csv') ?? 'json';
    const password = formData.get('password') as string | null;

    if (!file) {
      return handleApiError(new Error('Arquivo obrigatório'));
    }

    const content = await file.text();
    const result = await importVault(
      content,
      format,
      mode,
      vaultKey,
      password ?? undefined
    );
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
