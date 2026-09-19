// features/borrowing/borrowingApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BorrowedItem, MemberProfile } from './types';

export const borrowingApi = createApi({
  reducerPath: 'borrowingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Replace with your backend URL
  tagTypes: ['Borrowings', 'Profile'],
  endpoints: (builder) => ({
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
  }),
});

export const { 
  useGetMemberProfileQuery, 
  useGetCurrentBorrowingsQuery,
  useRenewBookMutation 
} = borrowingApi;