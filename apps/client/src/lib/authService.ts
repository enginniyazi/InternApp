/**
 * Auth API servisi — Kayıt, giriş, oturum doğrulama, çıkış.
 */

import { api } from './api';
import { setTokens, clearTokens } from './auth';

export interface UserData {
  id: string;
  email: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
  studentProfile?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;
    cvUrl?: string;
  } | null;
  companyProfile?: {
    id: string;
    companyName: string;
    website?: string;
    description?: string;
    logoUrl?: string;
    isApproved?: boolean;
  } | null;
}

interface AuthResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(email: string, password: string): Promise<UserData> {
  const data = await api.post<AuthResponse>('/auth/login', { email, password });
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function registerUser(
  email: string,
  password: string,
  role: 'STUDENT' | 'COMPANY',
  extra?: { firstName?: string; lastName?: string; companyName?: string }
): Promise<UserData> {
  const data = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    role,
    ...extra,
  });
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function fetchCurrentUser(): Promise<UserData> {
  return api.get<UserData>('/auth/me');
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    clearTokens();
  }
}
