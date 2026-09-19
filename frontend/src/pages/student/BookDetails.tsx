import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookActionButton } from '../../features/book/components/BookActionButton';
import { useGetBookByIdQuery } from '../../features/book/bookApi';


// Define the Tab structure
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'inventory', label: 'Inventory & Location' },
  { id: 'ai-insights', label: 'AI Insights' },
  { id: 'reviews', label: 'Reviews' },
];

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real data using RTK Query
  const { data: book, isLoading, isError } = useGetBookByIdQuery(id!);

  // Mock reviews for the demo (since we didn't build a review API)
  const reviews = [
    { id: 1, user: 'Alex Chen', rating: 5, comment: 'Essential reading for anyone in CS. The 4th edition is a massive improvement.', date: 'Oct 12, 2026' },
    { id: 2, user: 'Sarah Smith', rating: 4, comment: 'Very comprehensive, but quite heavy to carry around!', date: 'Sep 28, 2026' }
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Fetching book details...</p>
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 border border-red-100">
          <p className="font-bold">Book not found</p>
          <p className="text-sm">The book you are looking for does not exist or has been removed.</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline font-medium">
          &larr; Back to Catalog
        </button>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 1;
  const isHighDemand = book.availableCopies === 1;
  const isOutOfStock = book.availableCopies === 0;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 flex items-center gap-2 transition"
      >
        &larr; Back to Catalog
      </button>

      {/* --- Top Section: Book Info & Actions --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 mb-6">
        
        {/* Book Cover */}
        <div className="w-full md:w-1/4 flex-shrink-0">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full max-w-[240px] mx-auto md:mx-0 rounded-lg shadow-md object-cover aspect-[2/3]"
          />
        </div>

        {/* Book Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{book.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAvailable ? 'bg-green-100 text-green-700 border border-green-200' : 
                isHighDemand ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {isAvailable ? 'Available' : isHighDemand ? 'High Demand' : 'Out of Stock'}
              </span>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">{book.author}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
              <div>
                <span className="block text-gray-400 mb-1">ISBN</span>
                <span className="font-medium text-gray-800">{book.isbn}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Edition</span>
                <span className="font-medium text-gray-800">{book.edition}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Publisher</span>
                <span className="font-medium text-gray-800">{book.publisher}, {book.year}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Inventory</span>
                <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-gray-800'}`}>
                  {book.availableCopies} of {book.totalCopies} Copies
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-gray-100 max-w-md">
            {/* Reusable Action Button hooked up to RTK Query Mutation */}
            <BookActionButton book={book} />
            
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Zero latency hold confirmation & active mutex protection
            </p>
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Tabs --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-gray-50/50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 md:p-8 min-h-[300px]">
          
          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Synopsis</h3>
              <p className="text-gray-600 leading-relaxed mb-8">{book.description}</p>
              
              <h3 className="text-lg font-bold text-gray-800 mb-4">Table of Contents (Preview)</h3>
              <ul className="space-y-2 text-sm text-gray-600 border border-gray-100 rounded-lg p-4 bg-gray-50">
                <li className="flex justify-between border-b border-gray-200 pb-2"><span>1. Introduction</span> <span>p. 1</span></li>
                <li className="flex justify-between border-b border-gray-200 pb-2"><span>2. Intelligent Agents</span> <span>p. 34</span></li>
                <li className="flex justify-between border-b border-gray-200 pb-2"><span>3. Solving Problems by Searching</span> <span>p. 64</span></li>
                <li className="flex justify-between pb-1"><span>4. Beyond Classical Search</span> <span>p. 122</span></li>
              </ul>
            </div>
          )}

          {/* 2. Inventory & Location Tab */}
          {activeTab === 'inventory' && (
            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Physical Location</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm border border-blue-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Floor</p>
                    <p className="text-xl font-bold text-gray-900 mb-4">Floor {book.floor || '3'}</p>
                    <p className="text-sm text-gray-500 mb-1">Shelf Location</p>
                    <p className="text-xl font-bold text-gray-900 mb-4">Stacks B - {book.shelf || '006.3 RUS'}</p>
                    <p className="text-xs text-blue-700 font-semibold bg-blue-100 px-2.5 py-1 rounded inline-block">Standard Circulation (14 Days)</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Real-Time Stock Status</h3>
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Total Copies</span>
                    <span className="font-bold text-gray-900">{book.totalCopies}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Available on Shelf</span>
                    <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                      {book.availableCopies}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Waitlist Queue</span>
                    <span className="font-bold text-amber-600">{book.waitlistCount || 0} patrons</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. AI Insights Tab */}
          {activeTab === 'ai-insights' && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Smart Summary & Recommendation
                </h3>
                <p className="text-blue-800 leading-relaxed relative z-10 font-medium">
                  {book.aiSummary || `This book is highly recommended for Computer Science students focusing on ${book.category || 'AI'}. It covers foundational concepts but requires strong mathematical maturity. Based on your borrowing history, you might find the chapters on Machine Learning particularly relevant.`}
                </p>
              </div>
            </div>
          )}

          {/* 4. Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Student Reviews</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">Write a Review</button>
              </div>
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-800">{review.user}</div>
                      <div className="text-xs text-gray-400">{review.date}</div>
                    </div>
                    <div className="flex text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};