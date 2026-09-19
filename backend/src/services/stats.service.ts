import Book  from "../models/Book";
import Borrowing from "../models/Borrowing";
import { User } from "../models/User";

 
export const getDashboardStats = async () => {
  const totalBooks = await Book.countDocuments();

  const allBooks = await Book.find().select('quantity').lean();
  const totalAvailableCopies = allBooks.reduce((acc, book) => acc + book.quantity, 0);

  const borrowedBooksCount = await Borrowing.countDocuments({
    status: "BORROWED"
  });

  const today = new Date();
  const overdueBooksCount = await Borrowing.countDocuments({
    status: "BORROWED",
    dueDate: { $lt: today } 
  });

  const activeMembersCount = await User.countDocuments({ isLocked: false });

  const activeBorrowings = await Borrowing.find({
    status: "BORROWED",
    dueDate: { $lt: today }
  }).lean();

  let totalRevenue = 0;
  const daysInWeek = 7;
  const finePerWeek = daysInWeek * 2; 

  activeBorrowings.forEach(borrow => {
    const diffTime = today.getTime() - (new Date(borrow.dueDate)).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeksOverdue = Math.ceil(diffDays / daysInWeek);
    totalRevenue += weeksOverdue * finePerWeek;
  });

  return {
    totalBooks,
    totalAvailableCopies,
    borrowedBooksCount,
    activeMembersCount,
    overdueBooksCount,
    totalRevenue,
  };
};