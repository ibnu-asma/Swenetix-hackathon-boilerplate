// features/books/bookApi.ts
import { apiSlice } from "../api/apiSlice";
import {
  Book,
  BackendBook,
  CreateBookRequest,
  UpdateBookRequest,
  SearchBooksParams,
  PaginatedBooksResponse,
  Category,
} from "./types";

const defaultBookCover =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

export const mapBackendBook = (raw: BackendBook | any): Book => {
  const categoryId =
    typeof raw.categoryId === "object" && raw.categoryId !== null
      ? raw.categoryId._id || ""
      : raw.categoryId || "";

  const categoryName =
    typeof raw.categoryId === "object" && raw.categoryId !== null
      ? raw.categoryId.name || "General"
      : raw.category || "General";

  const quantity = Number(raw.quantity) || 1;
  const cover = raw.coverImage || raw.coverUrl || defaultBookCover;

  return {
    id: raw._id || raw.id || "",
    _id: raw._id || raw.id || "",
    title: raw.title || "Untitled Book",
    author: raw.author || "Unknown Author",
    isbn: raw.isbn || "N/A",
    categoryId,
    categoryName,
    category: categoryName,
    quantity,
    totalCopies: quantity,
    availableCopies: raw.availableCopies !== undefined ? raw.availableCopies : quantity,
    coverUrl: cover,
    coverImage: cover,
    description: raw.description || "",
    floor: raw.floor || "Floor 2",
    shelf: raw.shelf || "Section B",
    waitlistCount: raw.waitlistCount || 0,
    aiSummary: raw.aiSummary,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

export const bookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET ALL BOOKS (with Search, Category, Pagination)
    getBooks: builder.query<PaginatedBooksResponse, SearchBooksParams | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          const searchVal = params.search || params.searchTerm;
          if (searchVal) queryParams.search = searchVal;
          if (params.category && params.category !== "all") {
            queryParams.category = params.category;
          }
        }
        return {
          url: "/books",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (res: any): PaginatedBooksResponse => {
        const rawBooks = Array.isArray(res?.data) ? res.data : [];
        const normalizedBooks = rawBooks.map(mapBackendBook);
        const pagination = res?.pagination || {
          page: 1,
          limit: normalizedBooks.length,
          total: normalizedBooks.length,
          totalPages: 1,
        };

        return {
          data: normalizedBooks,
          books: normalizedBooks,
          total: pagination.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: pagination.totalPages,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Books" as const, id })),
              { type: "Books", id: "LIST" },
            ]
          : [{ type: "Books", id: "LIST" }],
    }),

    // 2. SEARCH BOOKS (Dedicated helper)
    searchBooks: builder.query<PaginatedBooksResponse, string>({
      query: (search) => ({
        url: "/books",
        method: "GET",
        params: { search },
      }),
      transformResponse: (res: any): PaginatedBooksResponse => {
        const rawBooks = Array.isArray(res?.data) ? res.data : [];
        const normalized = rawBooks.map(mapBackendBook);
        return {
          data: normalized,
          books: normalized,
          total: res?.pagination?.total || normalized.length,
          page: res?.pagination?.page || 1,
          limit: res?.pagination?.limit || 10,
          totalPages: res?.pagination?.totalPages || 1,
        };
      },
      providesTags: [{ type: "Books", id: "SEARCH" }],
    }),

    // 3. GET BOOK BY ID
    getBookById: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      transformResponse: (res: any): Book => {
        const raw = res?.data || res;
        return mapBackendBook(raw);
      },
      providesTags: (_result, _error, id) => [{ type: "Books", id }],
    }),

    // 4. CREATE BOOK
    addBook: builder.mutation<Book, CreateBookRequest>({
      query: (body) => ({
        url: "/books",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),

    // 5. UPDATE BOOK
    updateBook: builder.mutation<Book, UpdateBookRequest>({
      query: ({ id, ...body }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Books", id },
        { type: "Books", id: "LIST" },
      ],
    }),

    // 6. DELETE BOOK
    deleteBook: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Books", id },
        { type: "Books", id: "LIST" },
      ],
    }),

    // 7. GET CATEGORIES
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (res: any): Category[] => {
        return Array.isArray(res?.data) ? res.data : [];
      },
      providesTags: ["Categories"],
    }),

    // 8. CREATE CATEGORY
    createCategory: builder.mutation<Category, { name: string }>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useSearchBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = bookApi;