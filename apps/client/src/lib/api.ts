/**
 * Merkezi API istemcisi.
 *
 * - Her istekte JWT access token'ı otomatik ekler.
 * - 401 alındığında refresh token ile yeni token almayı dener.
 * - Başarısızsa kullanıcıyı logout eder.
 */

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** API'den dönen hata yapısı */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/** Refresh token ile yeni access token almayı dener */
async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

/** Temel fetch wrapper — header ekleme, hata yakalama */
async function request<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // FormData gönderiliyorsa Content-Type'ı tarayıcıya bırak (boundary otomatik eklenir)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 401 → refresh dene, başarılıysa isteği tekrarla
  if (res.status === 401 && retry) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      return request<T>(endpoint, options, false);
    }
    // Refresh de başarısız → logout
    clearTokens();
    window.location.reload();
    throw new ApiError(401, 'Oturum süresi doldu. Lütfen tekrar giriş yapın.');
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (body as { message?: string | string[] })?.message ?? 'Bir hata oluştu';
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    throw new ApiError(res.status, errorMessage, body);
  }

  return body as T;
}

// ─── Kısa Yol Fonksiyonları ───────────────────────────────────────

export const api = {
  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },

  /** Dosya yükleme (multipart/form-data) */
  upload<T>(endpoint: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    return request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};
