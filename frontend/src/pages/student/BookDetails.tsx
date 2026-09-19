// pages/student/BookDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useGetBookByIdQuery, useBorrowBookMutation } from '../../features/books/bookApi';

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

  // TODO: Replace with actual RTK Query Hook
  // const { data: book, isLoading } = useGetBookByIdQuery(id);
  
  // Mock data matching your screenshot's style
  const book = {
    id: id || '1',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    edition: '4th Edition',
    publisher: 'Pearson',
    year: '2020',
    available: true,
    copiesAvailable: 3,
    totalCopies: 5,
    coverUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=300&h=450', // Placeholder
    description: 'The long-anticipated revision of this best-selling text provides the most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence. This edition captures the current state of the art while retaining the accessible style that has made it a classic.',
    floor: '3',
    shelf: '006.3 RUS',
    waitlistCount: 0,
    aiSummary: 'This book is highly recommended for Computer Science students focusing on AI. It covers foundational concepts but requires strong mathematical maturity. Based on your borrowing history, you might find the chapters on Machine Learning particularly relevant.',
    reviews: [
      { id: 1, user: 'Alex Chen', rating: 5, comment: 'Essential reading for anyone in CS. The 4th edition is a massive improvement.', date: 'Oct 12, 2026' },
      { id: 2, user: 'Sarah Smith', rating: 4, comment: 'Very comprehensive, but quite heavy to carry around!', date: 'Sep 28, 2026' }
    ]
  };

  // Dynamic Borrow Button Logic (matching your screenshot)
  const renderBorrowAction = () => {
    if (book.copiesAvailable > 1) {
      return (
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-sm flex justify-center items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Borrow Now (Reserve Copy)
        </button>
      );
    } else if (book.copiesAvailable === 1) {
      return (
        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition shadow-sm flex justify-center items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Claim Final Copy
        </button>
      );
    } else {
      return (
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition border border-gray-300 flex justify-center items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Join Waitlist (#{book.waitlistCount})
        </button>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 flex items-center gap-2 transition">
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {book.available ? 'Available' : 'Out of Stock'}
              </span>
            </div>
            
            <p className="text-lg text-gray-600 mb-4">{book.author}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
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
                <span className="font-medium text-gray-800">{book.copiesAvailable} of {book.totalCopies} Copies</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-gray-100 max-w-md">
            {renderBorrowAction()}
            <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Zero latency hold confirmation & active mutex protection
            </p>
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Tabs --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
                  <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Floor</p>
                    <p className="text-xl font-bold text-gray-900 mb-4">Floor {book.floor}</p>
                    <p className="text-sm text-gray-500 mb-1">Shelf Location</p>
                    <p className="text-xl font-bold text-gray-900 mb-4">Stacks B - {book.shelf}</p>
                    <p className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded inline-block">Standard Circulation (14 Days)</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Real-Time Stock Status</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Total Copies</span>
                    <span className="font-bold text-gray-900">{book.totalCopies}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Available on Shelf</span>
                    <span className="font-bold text-green-600">{book.copiesAvailable}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Waitlist Queue</span>
                    <span className="font-bold text-amber-600">{book.waitlistCount} patrons</span>
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
                <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Smart Summary & Recommendation
                </h3>
                <p className="text-blue-800 leading-relaxed relative z-10">{book.aiSummary}</p>
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
                {book.reviews.map(review => (
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