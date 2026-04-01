import { request } from 'umi';

export interface Club {
  id: number;
  name: string;
  avatar: string;
  establishedDate: string;
  description: string;
  chairman: string;
  isActive: boolean;
}

// Fetch all clubs
export async function fetchClubs() {
  return request<Club[]>('/api/clubs');
}

// Add a new club
export async function addClub(data: Partial<Club>) {
  return request('/api/clubs', {
    method: 'POST',
    data,
  });
}

// Update a club
export async function updateClub(id: number, data: Partial<Club>) {
  return request(`/api/clubs/${id}`, {
    method: 'PUT',
    data,
  });
}

// Delete a club
export async function deleteClub(id: number) {
  return request(`/api/clubs/${id}`, {
    method: 'DELETE',
  });
}