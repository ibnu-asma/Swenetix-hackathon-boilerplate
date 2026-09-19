// src/pages/student/BorrowingHistory.tsx
import React, { useState } from 'react';
import { useGetBorrowingHistoryQuery } from '../../features/borrowing/borrowingApi';

export const BorrowingHistory: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetBorrowingHistoryQuery({ page, limit: 10 });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Borrowing History</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Book</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Borrowed</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Returned</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading history...</td></tr>
            ) : (
              data?.data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.borrowedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.returnedDate || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{item.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 bg-white">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {data?.totalPages || 1}</span>
          <button disabled={page === data?.totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 bg-white">Next</button>
        </div>
      </div>
    </div>
  );
};