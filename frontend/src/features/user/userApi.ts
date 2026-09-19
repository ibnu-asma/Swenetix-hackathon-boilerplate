import { apiSlice } from "../api/apiSlice";

export interface UserMember {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "member" | "librarian";
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  role?: "member" | "librarian";
  profileImage?: string;
}

export interface CreateMemberResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    temporaryPassword?: string;
  };
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET ALL USERS (Admin / Librarian only)
    getAllUsers: builder.query<UserMember[], void>({
      query: () => "/users/all",
      transformResponse: (res: any): UserMember[] => {
        return Array.isArray(res?.data) ? res.data : [];
      },
      providesTags: ["Members"],
    }),

    // 2. GET USER BY ID
    getUserById: builder.query<UserMember, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: any): UserMember => {
        return res?.data || res;
      },
      providesTags: (_result, _error, id) => [{ type: "Members", id }],
    }),

    // 3. ONBOARD NEW MEMBER (Admin / Librarian only)
    addMember: builder.mutation<CreateMemberResponse, CreateMemberRequest>({
      query: (body) => ({
        url: "/users/add-member",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Members", "Analytics"],
    }),

    // 4. DELETE USER (Admin / Librarian only)
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members", "Analytics"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useAddMemberMutation,
  useDeleteUserMutation,
} = userApi;
