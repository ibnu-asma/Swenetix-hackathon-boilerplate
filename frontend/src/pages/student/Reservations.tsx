// src/pages/student/Reservations.tsx
import React from 'react';

export const Reservations: React.FC = () => {
  // In a full app, you'd have a useGetReservationsQuery hook
  const mockReservations = [
    { id: '1', title: 'Operating System Concepts', author: 'Silberschatz, Galvin', status: 'waitlist', position: 3, eta: 'Tomorrow, 11:00 AM' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reservations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockReservations.map((res) => (
          <div key={res.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 leading-tight">{res.title}</h4>
              <p className="text-xs text-gray-500 mb-3">{res.author}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Position #{res.position} in queue</span>
                <span className="text-gray-400">Est. Available: {res.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};