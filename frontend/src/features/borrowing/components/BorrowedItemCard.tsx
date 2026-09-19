// features/borrowing/components/BorrowedItemCard.tsx
import React from 'react';
import { BorrowedItem } from '../types';

interface Props {
  item: BorrowedItem;
  onRenew: (id: string) => void;
  onReturn: (id: string) => void;
}

export const BorrowedItemCard: React.FC<Props> = ({ item, onRenew, onReturn }) => {
  // Determine styling based on status
  const isOverdue = item.status === 'overdue';
  const isDueSoon = item.status === 'due-soon';
  
  const borderColor = isOverdue ? 'border-red-200' : isDueSoon ? 'border-amber-200' : 'border-gray-200';
  const statusBadgeColor = isOverdue ? 'bg-red-100 text-red-700' : isDueSoon ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';

  return (
    <div className={`p-4 rounded-xl border ${borderColor} bg-white shadow-sm flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadgeColor}`}>
          {isOverdue ? `Overdue (Fine: $${item.fineAmount})` : isDueSoon ? 'Due Soon' : 'Active Loan'}
        </span>
        <span className="text-xs text-gray-500">
          {isOverdue ? '3 Days Overdue' : isDueSoon ? '1 Day Left' : '6 Days Left'}
        </span>
      </div>

      <div className="flex gap-4 mb-4">
        <img src={item.coverUrl} alt={item.title} className="w-16 h-24 object-cover rounded shadow" />
        <div>
          <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{item.author}</p>
          <p className="text-xs text-gray-400">ISBN: {item.isbn}</p>
          <p className="text-xs text-gray-500 mt-2">Borrowed: {item.borrowedDate}</p>
          <p className="text-xs text-gray-500">Due Date: {item.dueDate}</p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
        {isOverdue ? (
          <>
            <button onClick={() => onReturn(item.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-md font-medium transition">
              Return to Drop-Box
            </button>
            <button className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-md font-medium transition">
              Pay Fine
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => onRenew(item.id)} 
              disabled={item.renewalsRemaining === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm py-2 rounded-md font-medium transition"
            >
              {isDueSoon ? 'Renew Loan (Fast-Extend)' : 'Request 7-Day Renewal'}
            </button>
            {!isDueSoon && (
              <button onClick={() => onReturn(item.id)} className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-md font-medium transition">
                Return Book
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};