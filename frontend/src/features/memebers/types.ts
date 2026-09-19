// features/members/types.ts
export interface MemberProfile {
  id: string;
  name: string;
  memberId: string;
  tier: string;
  faculty: string;
  cardStatus: string;
  quota: {
    used: number;
    total: number;
    maxRenewals: number;
    checkoutLimitDays: number;
  };
  fines: number;
}
// features/members/types.ts

export interface Member {
  id: string;
  name: string;
  memberId: string; // e.g., "#LIB-8841"
  email: string;
  tier: string; // e.g., "Graduate Research"
  faculty: string; // e.g., "Faculty of Computer & Information Science"
  cardStatus: string; // e.g., "Valid thru Jul 2026"
  status: 'active' | 'suspended' | 'expired';
  joinDate: string;
  avatarUrl?: string;
  currentLoans: number;
  fines: number;
}

// Payload for creating a new member
export interface CreateMemberRequest extends Omit<Member, 'id' | 'currentLoans' | 'fines'> {
  password?: string; // If admin is creating the account
}

// Parameters for list/search queries
export interface SearchMembersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: 'all' | 'active' | 'suspended';
}

// Standard paginated response
export interface PaginatedMembersResponse {
  data: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


