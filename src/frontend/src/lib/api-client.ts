export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return {} as T;
  const data = await res.json();
  if (!res.ok) {
    const err = data.error ?? { code: 'ERROR', message: 'Erro desconhecido' };
    throw new ApiClientError(err.code, err.message, res.status, err.details);
  }
  return data as T;
}

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(url, { credentials: 'include' });
    return handleResponse<T>(res);
  },
  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    return handleResponse<T>(res);
  },
  put: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return handleResponse<T>(res);
  },
  patch: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return handleResponse<T>(res);
  },
  delete: async <T>(url: string): Promise<T> => {
    const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
    return handleResponse<T>(res);
  },
};
