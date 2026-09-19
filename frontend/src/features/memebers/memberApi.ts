// features/members/memberApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  Member, 
  CreateMemberRequest, 
  SearchMembersParams, 
  PaginatedMembersResponse 
} from './types';

export const memberApi = createApi({
  reducerPath: 'memberApi',
  // Replace with your actual backend URL
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Member'],
  endpoints: (builder) => ({
    
    // 1. LIST: Get all members with optional filtering/pagination
    getMembers: builder.query<PaginatedMembersResponse, SearchMembersParams | void>({
      query: (params) => ({
        url: '/members',
        method: 'GET',
        params: params || {}, // e.g., ?page=1&limit=10&searchTerm=Alex
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Member' as const, id })),
              { type: 'Member', id: 'LIST' },
            ]
          : [{ type: 'Member', id: 'LIST' }],
    }),

    // 2. GET BY ID (Member Detail)
    getMemberById: builder.query<Member, string>({
      query: (id) => `/members/${id}`,
      providesTags: (result, error, id) => [{ type: 'Member', id }],
    }),

    // 3. ADD (CREATE): Add a new member
    addMember: builder.mutation<Member, CreateMemberRequest>({
      query: (body) => ({
        url: '/members',
        method: 'POST',
        body,
      }),
      // Invalidate the list so the new member appears automatically
      invalidatesTags: [{ type: 'Member', id: 'LIST' }],
    }),

    // 4. DELETE: Remove a member
    deleteMember: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/members/${id}`,
        method: 'DELETE',
      }),
      // Invalidate both the list and the specific member's cache
      invalidatesTags: (result, error, id) => [
        { type: 'Member', id },
        { type: 'Member', id: 'LIST' },
      ],
    }),
  }),
});

// Export auto-generated hooks
export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useDeleteMemberMutation,
} = memberApi;