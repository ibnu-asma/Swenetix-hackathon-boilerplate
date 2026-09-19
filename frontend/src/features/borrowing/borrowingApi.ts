// features/borrowing/borrowingApi.ts
import { apiSlice } from "../api/apiSlice";
import { 
  BorrowedItem, 
  MemberProfile, 
  CreateBorrowRequest, 
  ReturnBookRequest,
  PaginatedBorrowHistoryResponse
} from "./types";

export const borrowingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Member Profile
    getMemberProfile: builder.query<MemberProfile, void>({
      query: () => "/member/profile",
      providesTags: ["Members"],
    }),
    
    // 2. Get Current Borrowings
    getCurrentBorrowings: builder.query<BorrowedItem[], void>({
      query: () => "/borrowings/current",
      providesTags: ["Borrowings"],
    }),
    
    // 3. Renew Book
    renewBook: builder.mutation<{ success: boolean }, string>({
      query: (bookId) => ({
        url: `/borrowings/${bookId}/renew`,
        method: "POST",
      }),
      invalidatesTags: ["Borrowings"],
    }),

    // 4. Borrow (Checkout) a Book
    borrowBook: builder.mutation<{ success: boolean; message: string }, CreateBorrowRequest>({
      query: (body) => ({
        url: "/borrowings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Borrowings", "Books"],
    }),

    // 5. Get Borrowing History
    getBorrowingHistory: builder.query<PaginatedBorrowHistoryResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/borrowings/history",
        method: "GET",
        params: params || { page: 1, limit: 10 },
      }),
      providesTags: ["Borrowings"],
    }),

    // 6. Return a Book
    returnBook: builder.mutation<{ success: boolean; message: string }, ReturnBookRequest>({
      query: ({ borrowingId, ...body }) => ({
        url: `/borrowings/${borrowingId}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Borrowings", "Books"],
    }),
  }),
});

export const { 
  useGetMemberProfileQuery, 
  useGetCurrentBorrowingsQuery,
  useRenewBookMutation,
  useBorrowBookMutation,
  useGetBorrowingHistoryQuery,
  useReturnBookMutation,
} = borrowingApi;