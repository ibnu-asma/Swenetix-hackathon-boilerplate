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

export const getCurrentBorrowings = async (userId: string) => {
  const borrowings = await Borrowing.find({
    userId,
    status: "BORROWED",
  })
    .populate("bookId")
    .sort({ borrowedAt: -1 });

  return borrowings.map((b: any) => ({
    id: b._id,
    userId: b.userId,
    bookId: b.bookId?._id,
    title: b.bookId?.title || "Unknown",
    author: b.bookId?.author || "Unknown",
    isbn: b.bookId?.isbn || "N/A",
    borrowedDate: b.borrowedAt?.toISOString().split('T')[0],
    dueDate: b.dueDate?.toISOString().split('T')[0],
    status: b.status.toLowerCase(),
    renewalsUsed: b.renewalsUsed || 0,
    renewalsRemaining: 2 - (b.renewalsUsed || 0),
    coverUrl: b.bookId?.coverUrl,
  }));
};

export const getBorrowingHistory = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const borrowings = await Borrowing.find({ userId })
    .populate("bookId")
    .sort({ borrowedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Borrowing.countDocuments({ userId });

  return {
    data: borrowings.map((b: any) => ({
      id: b._id,
      userId: b.userId,
      bookId: b.bookId?._id,
      title: b.bookId?.title || "Unknown",
      author: b.bookId?.author || "Unknown",
      isbn: b.bookId?.isbn || "N/A",
      borrowedDate: b.borrowedAt?.toISOString().split('T')[0],
      returnedDate: b.returnDate ? b.returnDate.toISOString().split('T')[0] : null,
      status: b.status.toLowerCase(),
      coverUrl: b.bookId?.coverUrl,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const renewBorrowing = async (borrowingId: string, userId: string) => {
  const borrowing = await Borrowing.findOne({ _id: borrowingId, userId });

  if (!borrowing) {
    throw new Error("Borrowing record not found");
  }

  if (borrowing.status !== "BORROWED") {
    throw new Error("Can only renew active borrowings");
  }

  const maxRenewals = 2;
  if ((borrowing.renewalsUsed || 0) >= maxRenewals) {
    throw new Error("Maximum renewals reached");
  }

  // Extend due date by 14 days
  const newDueDate = new Date(borrowing.dueDate);
  newDueDate.setDate(newDueDate.getDate() + 14);

  borrowing.dueDate = newDueDate;
  borrowing.renewalsUsed = (borrowing.renewalsUsed || 0) + 1;
  await borrowing.save();

  return borrowing;
};