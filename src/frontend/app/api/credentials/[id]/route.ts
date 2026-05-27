import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/session';
import {
  getCredential,
  updateCredential,
  deleteCredential,
} from '@/services/credential.service';
import { updateCredentialSchema } from '@/lib/validators/schemas';
import { apiSuccess, handleApiError } from '@/lib/api-error';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { vaultKey } = await requireSession();
    const credential = await getCredential(params.id, vaultKey);
    return apiSuccess(credential);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { vaultKey } = await requireSession();
    const body = await request.json();
    const parsed = updateCredentialSchema.parse(body);
    const credential = await updateCredential(params.id, parsed, vaultKey);
    return apiSuccess(credential);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireSession();
    await deleteCredential(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
