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
      query: () => "/users/profile",
      providesTags: ["Members"], // Matches the tag invalidated by updateMemberProfile
      transformResponse: (response: any) => {
        // Transform backend user data to MemberProfile format
        const user = response.data;
        return {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          memberId: user.memberId || `#LIB-${user._id.slice(-4)}`,
          email: user.email,
          tier: user.tier || "Standard Member",
          faculty: user.faculty || "Not specified",
          cardStatus: user.cardStatus || "Active",
          quota: {
            used: user.currentLoans || 0,
            total: 3,
            maxRenewals: 2,
            checkoutLimitDays: 14,
          },
          fines: user.fines || 0,
        };
      },
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
      invalidatesTags: ["Borrowings", "Books"], // Added Books in case catalog needs updating
    }),

    // 4. Borrow (Checkout) a Book
    borrowBook: builder.mutation<{ success: boolean; message: string }, CreateBorrowRequest>({
      query: (body) => ({
        url: "/borrowings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Borrowings", "Books", "Members"], // Added Members to update quota
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
      invalidatesTags: ["Borrowings", "Books", "Members"], // Added Members to update quota
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