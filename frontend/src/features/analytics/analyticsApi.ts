import { apiSlice } from "../api/apiSlice";

export interface CategoryStat {
  _id: string;
  name: string;
  bookCount: number;
  copyCount: number;
}

export interface DashboardStats {
  totalBooks: number;
  totalAvailableCopies: number;
  borrowedBooksCount: number;
  activeMembersCount: number;
  totalUsersCount: number;
  librariansCount: number;
  overdueBooksCount: number;
  returnedBooksCount: number;
  totalCategoriesCount: number;
  totalRevenue: number;
  categoryStats?: CategoryStat[];
}

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/stats/dashboard",
      transformResponse: (res: any): DashboardStats => {
        return res?.data || res;
      },
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = analyticsApi;
