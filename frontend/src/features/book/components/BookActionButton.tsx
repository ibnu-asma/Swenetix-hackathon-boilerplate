// features/books/components/BookActionButton.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBorrowBookMutation } from '../../borrowing/borrowingApi';
import { Book } from '../types';

interface BookActionButtonProps {
  book: Book;
}

export const BookActionButton: React.FC<BookActionButtonProps> = ({ book }) => {
  const navigate = useNavigate();
  const [borrowBook, { isLoading }] = useBorrowBookMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const isAvailable = book.availableCopies > 1;
  const isHighDemand = book.availableCopies === 1;
  const isOutOfStock = book.availableCopies === 0;

  const handleBorrow = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent Link from triggering
    
    try {
      // Trigger the RTK Query mutation we built earlier
      await borrowBook({ bookId: book.id }).unwrap();
      
      // RTK Query automatically invalidates 'Borrowings', 'History', and 'Book' tags
      // So the UI will update everywhere automatically!
      
      navigate('/student/my-books'); // Redirect to My Books page
    } catch (err: any) {
      // Handle the "mutex lock" error from the backend if two people click at once
      setErrorMsg(err.data?.message || 'Failed to borrow. Please try again.');
      setTimeout(() => setErrorMsg(''), 4000); // Clear error after 4 seconds
    }
  };

  // If out of stock, show a Link to the details page to join the waitlist
  if (isOutOfStock) {
    return (
      <Link 
        to={`/student/books/${book.id}`} 
        className="block w-full text-center text-xs font-medium py-2.5 rounded-md transition bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
      >
        Join Waitlist
      </Link>
    );
  }

  return (
    <div className="w-full">
      <button 
        onClick={handleBorrow} 
        disabled={isLoading}
        className={`w-full text-center text-xs font-medium py-2.5 rounded-md transition flex justify-center items-center gap-2 ${
          isAvailable 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-amber-500 hover:bg-amber-600 text-white'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Acquiring Lock...
          </>
        ) : (
          isAvailable ? 'Borrow Now (Reserve Copy)' : 'Claim Final Copy'
        )}
      </button>
      {errorMsg && <div className="text-red-500 text-[10px] mt-1.5 text-center font-medium">{errorMsg}</div>}
    </div>
  );
};