// pages/student/Dashboard.tsx
import React from 'react';
import { useGetMemberProfileQuery, useGetCurrentBorrowingsQuery, useRenewBookMutation } from '../../features/borrowing/borrowingApi';
import { BorrowedItemCard } from '../../features/borrowing/components/BorrowedItemCard';
// Assume CatalogItemCard is built similarly for the bottom section

export const StudentDashboard: React.FC = () => {
  const { data: profile, isLoading: isLoadingProfile } = useGetMemberProfileQuery();
  const { data: borrowings, isLoading: isLoadingBorrowings } = useGetCurrentBorrowingsQuery();
  const [renewBook] = useRenewBookMutation();

  if (isLoadingProfile || isLoadingBorrowings) return <div className="p-8">Loading dashboard...</div>;

  const hasOverdue = borrowings?.some(b => b.status === 'overdue');
  const quotaPercentage = profile ? (profile.quota.used / profile.quota.total) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      
      {/* 1. Welcome Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.name}</h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Member ID: <strong className="text-gray-900">{profile?.memberId}</strong></span>
            <span>•</span>
            <span>{profile?.faculty}</span>
            <span>•</span>
            <span>Card Status: <span className="text-green-600 font-medium">{profile?.cardStatus}</span></span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
            <div className="text-xl font-bold text-blue-700">{profile?.quota.used} / {profile?.quota.total}</div>
            <div className="text-xs text-blue-600 uppercase font-semibold">Quota In Use</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
            <div className="text-xl font-bold text-red-700">${profile?.fines.toFixed(2)}</div>
            <div className="text-xs text-red-600 uppercase font-semibold mb-1">Overdue Fine</div>
            <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded">Pay Online</button>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Quota & Restrictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Widget */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Borrowing Quota</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{profile?.quota.used} of {profile?.quota.total} Maximum Loans Utilized</span>
            <span className="font-bold text-blue-600">{quotaPercentage}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${quotaPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500">Standard checkout limit is {profile?.quota.checkoutLimitDays} days with max {profile?.quota.maxRenewals} renewals per title.</p>
        </div>

        {/* Restriction Alert (Conditional) */}
        {hasOverdue && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600 mt-1">
              {/* Warning Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-800 mb-1">Borrowing Eligibility Restriction</h3>
              <p className="text-sm text-amber-700 mb-3">1 Overdue Book Detected. New checkouts are temporarily suspended until the physical item is returned.</p>
              <div className="bg-amber-100/50 p-3 rounded text-xs text-amber-800 mb-3">
                <div className="flex justify-between"><span>Fine Rate:</span> <span className="font-semibold">$0.50 / day</span></div>
                <div className="flex justify-between"><span>Library Grace Period:</span> <span className="font-semibold">Expired Oct 11, 11:59 PM</span></div>
              </div>
              <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition">
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
          {/* Add Sync Icon here if needed */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {borrowings?.map((item) => (
            <BorrowedItemCard 
              key={item.id} 
              item={item} 
              onRenew={(id) => renewBook(id)} 
              onReturn={(id) => console.log('Return', id)} 
            />
          ))}
        </div>
      </div>

      {/* 4. Live Catalog Section (Placeholder based on your screenshot) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Live Catalog & Real-Time Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Map over CatalogItemCard here. Since the screenshot shows "High Demand", "Available", "Out of Stock", you'd pass those states to the card. */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
            [Catalog Cards Go Here - Similar to BorrowedItemCard logic]
          </div>
        </div>
      </div>

      {/* 5. Transaction Mutex Section (Bottom section from screenshot) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Transaction Mutex & Real-Time Concurrency Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-sm text-gray-600 space-y-3">
            <p>When you click <strong>Borrow Now</strong>, the system does not simply decrement a cached counter. It acquires an immediate database row mutex on the selected physical barcode asset.</p>
            <p>If two patrons attempt to checkout the <em>very last copy</em> at the exact same millisecond, our atomic isolation engine queues the requests in strict cryptographic arrival sequence.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
             <div className="text-xs text-gray-500 mb-2">Simulated Concurrency Race: Item #ISBN-0262 | State: 1 Copy in Stock</div>
             {/* Visual representation of the mutex lock */}
             <div className="bg-white p-3 rounded border border-gray-200 mb-2 flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-gray-800">Patron A (Alex Chen) claims Claim</div>
                  <div className="text-gray-400">Timestamp: 14:02:08.102 UTC</div>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Loan Committed</span>
             </div>
             <div className="bg-red-50 p-3 rounded border border-red-100 flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-red-800">Patron B claims Claim</div>
                  <div className="text-red-400">Timestamp: 14:02:08.104 UTC (+2ms)</div>
                </div>
                <span className="bg-red-200 text-red-800 px-2 py-1 rounded">Rollback - Waitlist #1</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};