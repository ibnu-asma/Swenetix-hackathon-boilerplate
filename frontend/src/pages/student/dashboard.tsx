// src/pages/student/Dashboard.tsx
import React from 'react';
import { useGetMemberProfileQuery, useGetCurrentBorrowingsQuery, useReturnBookMutation, useRenewBookMutation } from '../../features/borrowing/borrowingApi';
import { useGetBooksQuery } from '../../features/book/bookApi';
import { BookActionButton } from '../../features/book/components/BookActionButton';

export const Dashboard: React.FC = () => {
  // Fetch data using RTK Query
  const { data: profile, isLoading: isLoadingProfile } = useGetMemberProfileQuery();
  const { data: borrowings, isLoading: isLoadingBorrowings } = useGetCurrentBorrowingsQuery();
  const { data: catalog } = useGetBooksQuery({ limit: 3 }); // Fetch top 3 for catalog preview
  
  const [returnBook] = useReturnBookMutation();
  const [renewBook] = useRenewBookMutation();

  if (isLoadingProfile || isLoadingBorrowings) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  const hasOverdue = borrowings?.some(b => b.status === 'overdue');
  const quotaPercentage = profile ? (profile.quota.used / profile.quota.total) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Welcome & Quota Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-16 h-16 rounded-full object-cover border-4 border-blue-50" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.name || 'Alex Chen'}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
              <span>Member ID: <strong className="text-gray-900">{profile?.memberId || '#LIB-8841'}</strong></span>
              <span className="hidden md:inline">•</span>
              <span>{profile?.faculty || 'Faculty of Computer & Information Science'}</span>
              <span className="hidden md:inline">•</span>
              <span>Card Status: <span className="text-green-600 font-medium">{profile?.cardStatus || 'Valid thru Jul 2026'}</span></span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-blue-50 p-4 rounded-lg text-center border border-blue-100 min-w-[120px]">
            <div className="text-2xl font-bold text-blue-700">{profile?.quota.used || 3} / {profile?.quota.total || 5}</div>
            <div className="text-xs text-blue-600 uppercase font-semibold mt-1">Quota In Use</div>
          </div>
          <div className="flex-1 md:flex-none bg-red-50 p-4 rounded-lg text-center border border-red-100 min-w-[120px]">
            <div className="text-2xl font-bold text-red-700">${profile?.fines.toFixed(2) || '1.50'}</div>
            <div className="text-xs text-red-600 uppercase font-semibold mt-1 mb-2">Overdue Fine</div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded transition w-full font-medium">Pay Online</button>
          </div>
        </div>
      </div>

      {/* 2. Quota & Restrictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Borrowing Quota
            </h3>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">2 Slots Free</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{profile?.quota.used || 3} of {profile?.quota.total || 5} Maximum Loans Utilized</span>
            <span className="font-bold text-blue-600">{quotaPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${quotaPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Standard checkout limit is {profile?.quota.checkoutLimitDays || 21} days with max {profile?.quota.maxRenewals || 2} renewals per title.
          </p>
        </div>

        {/* Restriction Alert */}
        {hasOverdue && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600 flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-amber-900">Borrowing Eligibility Restriction</h3>
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded uppercase tracking-wide">Action Required</span>
              </div>
              <p className="text-sm text-amber-800 mb-3">1 Overdue Book Detected: <strong>Structure and Interpretation of Computer Programs</strong> is 3 days past its return threshold. New checkouts are temporarily suspended.</p>
              <div className="bg-amber-100/50 p-3 rounded text-xs text-amber-800 mb-4 flex justify-between">
                <span>Fine Rate: <strong>$0.50 / day</strong></span>
                <span>Library Grace Period: <strong>Expired Oct 11, 11:59 PM</strong></span>
              </div>
              <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Resolve Overdue Item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Currently Borrowed Items */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Currently Borrowed Items ({borrowings?.length || 0})</h2>
          <span className="text-xs text-gray-400 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Auto-renewal evaluates against real-time waitlists</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {borrowings?.map((item) => {
            const isOverdue = item.status === 'overdue';
            const isDueSoon = item.status === 'due-soon';
            const borderColor = isOverdue ? 'border-red-200' : isDueSoon ? 'border-amber-200' : 'border-gray-200';
            
            return (
              <div key={item.id} className={`p-5 rounded-xl border ${borderColor} bg-white shadow-sm flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isOverdue ? 'bg-red-100 text-red-700' : isDueSoon ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isOverdue ? `Overdue (Fine: $${item.fineAmount})` : isDueSoon ? 'Due Soon' : 'Active Loan'}
                  </span>
                  <span className={`text-xs font-bold ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-amber-500' : 'text-gray-500'}`}>
                    {isOverdue ? '3 Days Overdue' : isDueSoon ? '1 Day Left' : '6 Days Left'}
                  </span>
                </div>

                <div className="flex gap-4 mb-5">
                  <img src={item.coverUrl} alt={item.title} className="w-16 h-24 object-cover rounded shadow-md" />
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.author}</p>
                    <p className="text-[10px] text-gray-400">ISBN: {item.isbn}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Borrowed: {item.borrowedDate}</p>
                    <p className="text-[10px] text-gray-500">Due: {item.dueDate}</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                  {isOverdue ? (
                    <>
                      <button onClick={() => returnBook({ borrowingId: item.id })} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2.5 rounded-md font-medium transition">
                        Return to Drop-Box
                      </button>
                      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2.5 rounded-md font-medium transition">
                        Pay Fine
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => renewBook(item.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 rounded-md font-medium transition">
                        {isDueSoon ? 'Renew Loan (Fast-Extend)' : 'Request 7-Day Renewal'}
                      </button>
                      {!isDueSoon && (
                        <button onClick={() => returnBook({ borrowingId: item.id })} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2.5 rounded-md font-medium transition">
                          Return Book
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Live Catalog Preview */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Live Catalog & Real-Time Inventory
          </h2>
          <a 
  href="/student/books" 
  className="text-sm text-blue-600 font-medium hover:underline"
>
  View All Collections &rarr;
</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {catalog?.data.map((book) => {
            const isAvailable = book.availableCopies > 1;
            const isHighDemand = book.availableCopies === 1;
            
            return (
              <div key={book.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="relative mb-4">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-sm" />
                  {isHighDemand && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">High Demand</span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 leading-tight mb-1">{book.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{book.author}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-medium mb-3">
                    <span className={isAvailable ? 'text-green-600' : isHighDemand ? 'text-amber-600' : 'text-red-500'}>
                      {book.availableCopies} of {book.totalCopies} Available
                    </span>
                    <span className="text-gray-400">{book.floor} • {book.shelf}</span>
                  </div>
                  
<BookActionButton book={book} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Transaction Mutex Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Transaction Mutex & Real-Time Concurrency Architecture</h2>
            <p className="text-xs text-gray-500">How BiblioSmart prevents race conditions on scarce inventory</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-sm text-gray-600 space-y-3">
            <p>When you click <strong>Borrow Now</strong>, the system does not simply decrement a cached counter. It acquires an immediate database row mutex on the selected physical barcode asset.</p>
            <p>If two patrons attempt to checkout the <em>very last copy</em> at the exact same millisecond, our atomic isolation engine queues the requests in strict cryptographic arrival sequence.</p>
            <div className="flex gap-4 pt-2">
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Zero Negative Inventory</span>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Sub-15ms Latency Lock</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 shadow-inner">
             <div className="text-gray-500 mb-2">// Simulated Concurrency Race: Item #ISBN-0262 | State: 1 Copy in Stock</div>
             <div className="bg-gray-800 p-3 rounded border border-gray-700 mb-2 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">Patron A (Alex Chen) claims Claim</div>
                  <div className="text-gray-400 text-[10px]">Timestamp: 14:02:08.102 UTC · Row Mutex Granted</div>
                </div>
                <span className="bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-1 rounded">Loan Committed</span>
             </div>
             <div className="bg-gray-800 p-3 rounded border border-gray-700 flex justify-between items-center">
                <div>
                  <div className="text-red-400 font-bold">Patron B claims Claim</div>
                  <div className="text-gray-500 text-[10px]">Timestamp: 14:02:08.104 UTC (+2ms) · Mutex Contended</div>
                </div>
                <span className="bg-red-900/50 text-red-400 border border-red-800 px-2 py-1 rounded">Rollback - Waitlist #1</span>
             </div>
             <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-[10px] text-gray-500">
               <span>🔓 Database Lock Release: 0.003s</span>
               <span>Result: Accurate Stock = 0</span>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};