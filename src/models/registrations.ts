import { request } from 'umi';

export interface Registration {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skills: string;
  clubId: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note?: string;
}

// Fetch all registrations
export async function fetchRegistrations() {
  return request<Registration[]>('/api/registrations');
}

// Add a new registration
export async function addRegistration(data: Partial<Registration>) {
  return request('/api/registrations', {
    method: 'POST',
    data,
  });
}

// Update a registration
export async function updateRegistration(id: number, data: Partial<Registration>) {
  return request(`/api/registrations/${id}`, {
    method: 'PUT',
    data,
  });
}

// Delete a registration
export async function deleteRegistration(id: number) {
  return request(`/api/registrations/${id}`, {
    method: 'DELETE',
  });
}