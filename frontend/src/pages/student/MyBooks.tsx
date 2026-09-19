// src/pages/student/MyBooks.tsx
import React from 'react';
import { useGetCurrentBorrowingsQuery, useReturnBookMutation, useRenewBookMutation } from '../../features/borrowing/borrowingApi';

export const MyBooks: React.FC = () => {
  const { data: borrowings, isLoading } = useGetCurrentBorrowingsQuery();
  const [returnBook] = useReturnBookMutation();
  const [renewBook] = useRenewBookMutation();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your books...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Borrowed Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {borrowings?.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">You have no active borrowings.</p>
          </div>
        ) : (
          borrowings?.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                  item.status === 'due-soon' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status === 'overdue' ? `Overdue ($${item.fineAmount})` : item.status === 'due-soon' ? 'Due Soon' : 'Active Loan'}
                </span>
              </div>
              <div className="flex gap-4 mb-4">
                <img src={item.coverUrl} alt={item.title} className="w-20 h-28 object-cover rounded shadow-md" />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.author}</p>
                  <p className="text-[10px] text-gray-400">Due: {item.dueDate}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button onClick={() => renewBook(item.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded font-medium transition">Renew</button>
                <button onClick={() => returnBook({ borrowingId: item.id })} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-2 rounded font-medium transition">Return</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};