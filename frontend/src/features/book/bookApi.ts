// features/books/bookApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  Book, 
  CreateBookRequest, 
  UpdateBookRequest, 
  SearchBooksParams, 
  PaginatedBooksResponse 
} from './types';

export const bookApi = createApi({
  reducerPath: 'bookApi',
  // Replace with your actual backend URL (e.g., 'http://localhost:5000/api')
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    
    // 1. LIST & SEARCH: Get all books with optional filtering/pagination
    getBooks: builder.query<PaginatedBooksResponse, SearchBooksParams | void>({
      query: (params) => ({
        url: '/books',
        method: 'GET',
        params: params || {}, // Passes ?page=1&limit=10&searchTerm=AI etc.
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Book' as const, id })),
              { type: 'Book', id: 'LIST' },
            ]
          : [{ type: 'Book', id: 'LIST' }],
    }),

    // 2. SEARCH QUERY: Dedicated endpoint if your backend separates search logic
    searchBooks: builder.query<PaginatedBooksResponse, string>({
      query: (searchTerm) => `/books/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: 'Book', id: 'SEARCH' }],
    }),

    // 3. GET BY ID: Fetch a single book's full details
    getBookById: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),

    // 4. ADD (CREATE): Add a new book to the system
    addBook: builder.mutation<Book, CreateBookRequest>({
      query: (body) => ({
        url: '/books',
        method: 'POST',
        body,
      }),
      // Invalidate the list so it refetches automatically after adding
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
    }),

    // 5. EDIT (UPDATE): Modify an existing book
    updateBook: builder.mutation<Book, UpdateBookRequest>({
      query: ({ id, ...body }) => ({
        url: `/books/${id}`,
        method: 'PUT', // or PATCH depending on your backend
        body,
      }),
      // Invalidate both the specific book and the list
      invalidatesTags: (result, error, { id }) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
      ],
    }),

    // 6. DELETE: Remove a book
    deleteBook: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
      ],
    }),
  }),
});

// Export auto-generated hooks for use in React components
export const {
  useGetBooksQuery,
  useSearchBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;