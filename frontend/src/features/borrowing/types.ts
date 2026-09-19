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
export interface MemberProfile {
  email: string;
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

// 1. Payload for borrowing a book
export interface CreateBorrowRequest {
  bookId: string;
  memberId?: string; // Optional if member is inferred from auth token
}

// 2. Payload for returning a book
export interface ReturnBookRequest {
  borrowingId: string;
  returnCondition?: 'good' | 'damaged' | 'lost';
}

// 3. History Item (extends BorrowedItem with returned status)
export interface BorrowHistoryItem extends Omit<BorrowedItem, 'status'> {
  status: 'returned' | 'overdue' | 'lost';
  returnedDate: string | null;
}

// 4. Paginated Response for History
export interface PaginatedBorrowHistoryResponse {
  data: BorrowHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}