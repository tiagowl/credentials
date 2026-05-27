import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { SessionError } from './session';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return apiError(error.code, error.message, error.status, error.details);
  }
  if (error instanceof SessionError) {
    return apiError('UNAUTHORIZED', 'Sessão inválida ou expirada', 401);
  }
  if (error instanceof ZodError) {
    return apiError('VALIDATION_ERROR', 'Dados inválidos', 400, error.errors);
  }
  console.error('[API Error]', error);
  return apiError('INTERNAL_ERROR', 'Erro interno do servidor', 500);
}
