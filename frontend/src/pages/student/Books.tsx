// src/pages/student/Books.tsx
import React, { useState } from 'react';
import { useGetBooksQuery } from '../../features/book/bookApi';


export const Books: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useGetBooksQuery({ searchTerm, limit: 12 });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Catalog & Real-Time Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Explore institutional holdings with verified millisecond stock synchronization.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <button className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md">All Collections</button>
          <button className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition">Computer Science</button>
          <button className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition">Data Science & AI</button>
        </div>
      </div>

      <div className="mb-6 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input 
          type="text" 
          placeholder="Search by title, author, ISBN, or subject..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data.map((book) => {
            const isAvailable = book.availableCopies > 1;
            const isHighDemand = book.availableCopies === 1;
            return (
              <div key={book.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                <div className="relative mb-4">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-sm" />
                  {isHighDemand && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">High Demand</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{book.title}</h4>
                  <p className="text-xs text-gray-500 mb-3">{book.author}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-medium mb-3">
                    <span className={isAvailable ? 'text-green-600' : isHighDemand ? 'text-amber-600' : 'text-red-500'}>
                      {book.availableCopies} of {book.totalCopies} Available
                    </span>
                    <span className="text-gray-400">{book.floor} • {book.shelf}</span>
                  </div>
<a 
  href={`/student/books/${book.id}`} 
  className={`block w-full text-center text-xs font-medium py-2.5 rounded-md transition ${
    isAvailable ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
    isHighDemand ? 'bg-amber-500 hover:bg-amber-600 text-white' : 
    'bg-gray-100 hover:bg-gray-200 text-gray-800'
  }`}
>
  {isAvailable ? 'Borrow Now' : isHighDemand ? 'Claim Final Copy' : 'Join Waitlist'}
</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};