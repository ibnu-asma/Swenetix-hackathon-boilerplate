import Borrowing from "../models/Borrowing";
import Book from "../models/Book";
import { User } from "../models/User";

interface CreateBorrowingData {
  userId: string;
  bookId: string;
}

export const createBorrowing = async (data: CreateBorrowingData) => {
  const { userId, bookId } = data;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.quantity <= 0) { 
    throw new Error("This book is currently out of stock");
  }

  const activeBorrowings = await Borrowing.countDocuments({
    userId,
    status: "BORROWED",
  });

  if (activeBorrowings >= 3) {
    throw new Error("User has reached the maximum limit of 3 books");
  }

  // Calculate borrowing and due dates
  const borrowedAt = new Date();
  const dueDate = new Date(borrowedAt);
  dueDate.setDate(dueDate.getDate() + 14);

  // Create borrowing record
  const borrowing = await Borrowing.create({
    userId,
    bookId,
    borrowedAt,
    dueDate,
    status: "BORROWED",
  });

  book.quantity -= 1;
  await book.save();

  return borrowing;
};

export const returnBorrowing = async (borrowingId: string) => {
  const borrowing = await Borrowing.findById(borrowingId);

  if (!borrowing) {
    throw new Error("Borrowing record not found");
  }

  if (borrowing.status === "RETURNED") {
    throw new Error("This book has already been returned");
  }

  // Update borrowing record
  borrowing.returnDate = new Date();
  borrowing.status = "RETURNED";
  await borrowing.save();

  const book = await Book.findById(borrowing.bookId);
  if (book) {
    book.quantity += 1;
    await book.save();
  }

  return borrowing;
};