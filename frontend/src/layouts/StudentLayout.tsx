// src/layouts/StudentLayout.tsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export const StudentLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <span className="text-xl font-bold text-blue-700 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              BiblioSmart
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {[
              { name: 'Dashboard', path: '/student/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { name: 'Book Catalog', path: '/student/books', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'My Books', path: '/student/my-books', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
              { name: 'Borrowing History', path: '/student/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Reservations', path: '/student/reservations', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
              { name: 'Profile', path: '/student/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Engine State Widget */}
        <div className="p-4 m-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Engine State
          </div>
          <p className="text-xs text-blue-700 font-medium mb-1">Concurrency Lock Engine: ACTIVE</p>
          <p className="text-[10px] text-blue-600">Zero race conditions on last copy transactions.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input type="text" placeholder="Search catalog, ISBN, title, or borrower record..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Sync Active
            </span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium text-gray-500 rounded-md hover:bg-white transition">Librarian Admin</button>
              <button className="px-3 py-1 text-xs font-medium bg-white text-blue-600 rounded-md shadow-sm">Student Member</button>
            </div>
            <button className="text-gray-400 hover:text-gray-600 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4 cursor-pointer">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900 leading-none">Alex Chen</p>
                <p className="text-xs text-gray-500">Student Member</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};