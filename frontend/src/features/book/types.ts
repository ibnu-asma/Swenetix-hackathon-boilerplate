export type BookAvailability = 'available' | 'high-demand' | 'out-of-stock';

export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  availability: BookAvailability;
  copiesAvailable: number;
  totalCopies: number;
  floor?: string;
  shelf?: string;
}
// features/books/types.ts

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  publisher: string;
  year: string;
  description: string;
  coverUrl: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  floor: string;
  shelf: string;
  waitlistCount: number;
  aiSummary?: string; // Optional, for the AI Insights tab
}

// Payload for creating a new book (omits system-generated fields like id)
export interface CreateBookRequest extends Omit<Book, 'id' | 'waitlistCount'> {}

// Payload for updating a book (all fields optional except id)
export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

// Parameters for list and search queries
export interface SearchBooksParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  availability?: 'all' | 'available' | 'out-of-stock';
}

// Standard paginated response structure
export interface PaginatedBooksResponse {
  data: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}