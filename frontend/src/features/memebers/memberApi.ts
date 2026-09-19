// features/users/memberApi.ts
import { apiSlice } from "../api/apiSlice";
import { 
  Member, 
  CreateMemberRequest, 
  SearchMembersParams, 
  PaginatedMembersResponse, 
  UpdateMemberProfileRequest
} from "./types";

export const memberApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. LIST: Get all members with optional filtering/pagination
    getMembers: builder.query<PaginatedMembersResponse, SearchMembersParams | void>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Members" as const, id })),
              { type: "Members", id: "LIST" },
            ]
          : [{ type: "Members", id: "LIST" }],
    }),

    // 2. GET BY ID (Member Detail)
    getMemberById: builder.query<Member, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Members", id }],
    }),

    // 3. ADD (CREATE): Add a new member
    addMember: builder.mutation<Member, CreateMemberRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Members", id: "LIST" }],
    }),

    // 4. DELETE: Remove a member
    deleteMember: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Members", id },
        { type: "Members", id: "LIST" },
      ],
    }),
    updateMemberProfile: builder.mutation<Member, UpdateMemberProfileRequest>({
  query: (body) => ({
    url: '/users/profile', // Or `/users/${id}` depending on your backend
    method: 'PUT',
    body,
  }),

}),

  }),
  

});

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useDeleteMemberMutation,
} = memberApi;