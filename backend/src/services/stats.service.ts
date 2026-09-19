import Book from "../models/Book";
import Borrowing from "../models/Borrowing";
import { User } from "../models/User";
import Category from "../models/Catagory";

export const getDashboardStats = async () => {
  const totalBooks = await Book.countDocuments();

  const allBooks = await Book.find().select("quantity categoryId").lean();
  const totalAvailableCopies = allBooks.reduce((acc, book) => acc + (Number(book.quantity) || 0), 0);

  const borrowedBooksCount = await Borrowing.countDocuments({
    status: "BORROWED",
  });

  const today = new Date();
  const overdueBooksCount = await Borrowing.countDocuments({
    $or: [
      { status: "OVERDUE" },
      { status: "BORROWED", dueDate: { $lt: today } },
    ],
  });

  const returnedBooksCount = await Borrowing.countDocuments({
    status: "RETURNED",
  });

  const activeMembersCount = await User.countDocuments({
    role: "member",
  });

  const totalUsersCount = await User.countDocuments();
  const librariansCount = await User.countDocuments({
    role: "librarian",
  });

  const totalCategoriesCount = await Category.countDocuments();

  // Find all overdue borrowings to calculate fine revenue
  const overdueBorrowings = await Borrowing.find({
    $or: [
      { status: "OVERDUE" },
      { status: "BORROWED", dueDate: { $lt: today } },
    ],
  }).lean();

  let totalRevenue = 0;
  const daysInWeek = 7;
  const finePerWeek = daysInWeek * 2; // $14 per overdue week

  overdueBorrowings.forEach((borrow) => {
    const diffTime = today.getTime() - new Date(borrow.dueDate).getTime();
    if (diffTime > 0) {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeksOverdue = Math.ceil(diffDays / daysInWeek);
      totalRevenue += weeksOverdue * finePerWeek;
    }
  });

  // Category distribution
  const categories = await Category.find().lean();
  const categoryStats = categories.map((cat) => {
    const booksInCat = allBooks.filter(
      (b) => b.categoryId && b.categoryId.toString() === cat._id.toString()
    );
    const copies = booksInCat.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
    return {
      _id: cat._id,
      name: cat.name,
      bookCount: booksInCat.length,
      copyCount: copies,
    };
  });

  return {
    totalBooks,
    totalAvailableCopies,
    borrowedBooksCount,
    activeMembersCount,
    totalUsersCount,
    librariansCount,
    overdueBooksCount,
    returnedBooksCount,
    totalCategoriesCount,
    totalRevenue,
    categoryStats,
  };
};