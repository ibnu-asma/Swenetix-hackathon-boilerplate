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

// features/borrowing/types.ts
export type BorrowStatus = 'active' | 'overdue' | 'due-soon';

export interface BorrowedItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverUrl: string;
  status: BorrowStatus;
  borrowedDate: string;
  dueDate: string;
  fineAmount?: number;
  renewalsRemaining?: number;
}

// features/books/types.ts
export type BookAvailability = 'available' | 'high-demand' | 'out-of-stock';

export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  availability: BookAvailability;
  copiesAvailable: number;
  totalCopies: number;
  floor?: string;
  shelf?: string;
}