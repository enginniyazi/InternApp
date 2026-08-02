/**
 * Internships API servisi — İlan CRUD işlemleri.
 */

import { api } from './api';
import type { InternshipData } from '../components/internships/InternshipCard';

interface InternshipApiItem {
  id: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  requirements: string[];
  createdAt: string;
  updatedAt?: string;
  company?: {
    companyName?: string;
    logoUrl?: string;
  };
}

/** Backend yanıtını frontend InternshipData formatına dönüştür */
function toInternshipData(item: InternshipApiItem): InternshipData {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location,
    isRemote: item.isRemote,
    requirements: item.requirements,
    createdAt: item.createdAt,
    company: item.company,
  };
}

export async function fetchInternships(params?: {
  search?: string;
  location?: string;
  isRemote?: boolean;
}): Promise<InternshipData[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.location) query.set('location', params.location);
  if (params?.isRemote !== undefined) query.set('isRemote', String(params.isRemote));

  const qs = query.toString();
  const url = qs ? `/internships?${qs}` : '/internships';
  const items = await api.get<InternshipApiItem[]>(url);
  return items.map(toInternshipData);
}

export async function fetchMyInternships(): Promise<InternshipData[]> {
  const items = await api.get<InternshipApiItem[]>('/internships/my');
  return items.map(toInternshipData);
}

export async function createInternship(data: {
  title: string;
  description: string;
  location: string;
  isRemote?: boolean;
  requirements?: string[];
}): Promise<InternshipData> {
  const item = await api.post<InternshipApiItem>('/internships', data);
  return toInternshipData(item);
}

export async function updateInternship(
  id: string,
  data: {
    title?: string;
    description?: string;
    location?: string;
    isRemote?: boolean;
    requirements?: string[];
  }
): Promise<InternshipData> {
  const item = await api.patch<InternshipApiItem>(`/internships/${id}`, data);
  return toInternshipData(item);
}

export async function deleteInternship(id: string): Promise<void> {
  await api.delete(`/internships/${id}`);
}
