import { request } from 'umi';

export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skills: string;
  clubId: number;
}

// Fetch all members
export async function fetchMembers() {
  return request<Member[]>('/api/members');
}

// Update a member's club
export async function updateMemberClub(memberIds: number[], newClubId: number) {
  return request('/api/members/change-club', {
    method: 'POST',
    data: { memberIds, newClubId },
  });
}