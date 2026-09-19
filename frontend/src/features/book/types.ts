export type BookAvailability = 'available' | 'high-demand' | 'out-of-stock';

export interface Category {
  _id: string;
  name: string;
}

export interface BackendBook {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: Category | string;
  quantity: number;
  coverImage?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Book {
  id: string;
  _id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  categoryName: string;
  category: string;
  quantity: number;
  totalCopies: number;
  availableCopies: number;
  coverUrl: string;
  coverImage?: string;
  description: string;
  floor?: string;
  shelf?: string;
  waitlistCount?: number;
  aiSummary?: string;
  edition?: string;
  publisher?: string;
  year?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  quantity: number;
  description?: string;
  coverImage?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

export interface SearchBooksParams {
  page?: number;
  limit?: number;
  search?: string;
  searchTerm?: string;
  category?: string;
}

export interface PaginatedBooksResponse {
  data: Book[];
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}