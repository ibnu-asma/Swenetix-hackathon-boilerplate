// features/borrowing/borrowingApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  BorrowedItem, 
  MemberProfile, 
  CreateBorrowRequest, 
  ReturnBookRequest,
  PaginatedBorrowHistoryResponse
} from './types';

export const borrowingApi = createApi({
  reducerPath: 'borrowingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Replace with your backend URL
  // Added 'History' and 'Book' to tagTypes
  tagTypes: ['Borrowings', 'Profile', 'History', 'Book'],
  endpoints: (builder) => ({
    
    // --- EXISTING ENDPOINTS ---
    getMemberProfile: builder.query<MemberProfile, void>({
      query: () => '/member/profile',
      providesTags: ['Profile'],
    }),
    
    getCurrentBorrowings: builder.query<BorrowedItem[], void>({
      query: () => '/borrowings/current',
      providesTags: ['Borrowings'],
    }),
    
    renewBook: builder.mutation<{ success: boolean }, string>({
      query: (bookId) => ({
        url: `/borrowings/${bookId}/renew`,
        method: 'POST',
      }),
      invalidatesTags: ['Borrowings'],
    }),

    // --- NEW ENDPOINTS ---

    // 1. BORROW (CHECKOUT) A BOOK
    borrowBook: builder.mutation<{ success: boolean; message: string }, CreateBorrowRequest>({
      query: (body) => ({
        url: '/borrowings', // or '/borrowings/checkout'
        method: 'POST',
        body,
      }),
      // Invalidate current borrowings, history, and the specific book (to update available copies)
      invalidatesTags: ['Borrowings', 'History', 'Book'],
    }),

    // 2. GET BORROWING HISTORY (With Pagination)
    getBorrowingHistory: builder.query<PaginatedBorrowHistoryResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/borrowings/history',
        method: 'GET',
        params: params || { page: 1, limit: 10 },
      }),
      providesTags: ['History'],
    }),

    // 3. RETURN A BOOK
    returnBook: builder.mutation<{ success: boolean; message: string }, ReturnBookRequest>({
      query: ({ borrowingId, ...body }) => ({
        url: `/borrowings/${borrowingId}/return`,
        method: 'POST', // Use 'PUT' if your backend uses PUT for updates
        body,
      }),
      // Invalidate current borrowings to remove the book from the dashboard
      // Invalidate history to add the returned book to the history log
      // Invalidate Book to update available copies in the catalog
      invalidatesTags: ['Borrowings', 'History', 'Book'],
    }),
  }),
});

export const { 
  useGetMemberProfileQuery, 
  useGetCurrentBorrowingsQuery,
  useRenewBookMutation,
  // Export new hooks
  useBorrowBookMutation,
  useGetBorrowingHistoryQuery,
  useReturnBookMutation,
} = borrowingApi;