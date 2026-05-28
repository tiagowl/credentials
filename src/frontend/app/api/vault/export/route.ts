import { requireSession } from '@/lib/session';
import { exportVault } from '@/services/export.service';
import { exportSchema } from '@/lib/validators/schemas';
import { handleApiError, AppError } from '@/lib/api-error';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { vaultKey, userId } = await requireSession();
    const body = await request.json();
    const parsed = exportSchema.parse(body);
    const result = await exportVault(
      userId,
      parsed.format,
      parsed.password,
      vaultKey
    );

    return new NextResponse(result.data, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return handleApiError(error);
    }
    return handleApiError(error);
  }
}
