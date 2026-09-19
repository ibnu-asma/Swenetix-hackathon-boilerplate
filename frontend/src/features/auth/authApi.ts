import { apiSlice } from "../api/apiSlice";
import type { User } from "./authSlice";
import { normalizeRole } from "./authSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "member" | "librarian" | "admin";
  profileImage?: string;
}

export interface RawAuthResponse {
  success: boolean;
  token: string;
  role: string;
  user: {
    id?: string;
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  role: "admin" | "member";
  user: User;
  message?: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: RawAuthResponse): AuthResponse => {
        const normalizedRole = normalizeRole(response.role || response.user?.role);
        return {
          success: response.success,
          token: response.token,
          role: normalizedRole,
          user: {
            id: response.user?._id || response.user?.id,
            firstName: response.user?.firstName || "",
            lastName: response.user?.lastName || "",
            email: response.user?.email || "",
            role: normalizedRole,
            profileImage: response.user?.profileImage,
          },
          message: response.message,
        };
      },
      invalidatesTags: ["Books", "Members", "Borrowings"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        // Backend DB requires role to be 'member' or 'librarian'
        const backendRole = userData.role === "admin" ? "librarian" : userData.role;
        return {
          url: "/auth/register",
          method: "POST",
          body: {
            ...userData,
            role: backendRole,
          },
        };
      },
      transformResponse: (response: RawAuthResponse): AuthResponse => {
        const normalizedRole = normalizeRole(response.role || response.user?.role);
        return {
          success: response.success,
          token: response.token,
          role: normalizedRole,
          user: {
            id: response.user?._id || response.user?.id,
            firstName: response.user?.firstName || "",
            lastName: response.user?.lastName || "",
            email: response.user?.email || "",
            role: normalizedRole,
            profileImage: response.user?.profileImage,
          },
          message: response.message,
        };
      },
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;