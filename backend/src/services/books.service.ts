import Book from "../models/Book";
import Category from "../models/Catagory";

interface GetBooksOptions {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

interface CreateBookData {
  title: string;
  author: string;
  isbn: string;
  coverImage?: string;
  categoryId: string;
  description?: string;
  quantity: number;
}

interface UpdateBookData {
  title?: string;
  author?: string;
  isbn?: string;
  coverImage?: string;
  categoryId?: string;
  description?: string;
  quantity: number;
}

export const createBook = async (data: CreateBookData) => {
  const { title, author, isbn, coverImage, categoryId, description, quantity } = data;

  // Make sure the category exists
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  // Prevent duplicate ISBN
  const existingBook = await Book.findOne({ isbn });

  if (existingBook) {
    throw new Error("A book with this ISBN already exists");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const book = await Book.create({
    title,
    author,
    coverImage,
    isbn,
    categoryId,
    description,
    quantity,
  });

  return book;
};

export const getBooks = async ({
  search,
  category,
  page = 1,
  limit = 10,
}: GetBooksOptions = {}) => {
  const filter: Record<string, unknown> = {};

  // Search by title or author
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by category
  if (category) {
    filter.categoryId = category;
  }

  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Book.countDocuments(filter),
  ]);

  return {
    books,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getBookById = async (bookId: string) => {
  const book = await Book.findById(bookId)
    .populate("categoryId", "name")
    .lean();

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
};

export const updateBook = async (
  bookId: string,
  data: UpdateBookData,
) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  // If category is being changed, make sure it exists
  if (data.categoryId) {
    const category = await Category.findById(data.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }
  }

  if(data.quantity <= 0){
    throw new Error("Quantity must be greater than 0");
  }

  // If ISBN is being changed, make sure it isn't already used
  if (data.isbn && data.isbn !== book.isbn) {
    const existingBook = await Book.findOne({
      isbn: data.isbn,
      _id: { $ne: bookId },
    });

    if (existingBook) {
      throw new Error("A book with this ISBN already exists");
    }
  }

  Object.assign(book, data);

  await book.save();

  return book;
};

export const deleteBook = async (bookId: string) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  await Book.deleteOne({ _id: bookId });

  return {
    message: "Book deleted successfully",
  };
};