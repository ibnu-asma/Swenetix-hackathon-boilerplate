// src/pages/student/Profile.tsx
import React from 'react';
import { useGetMemberProfileQuery } from '../../features/borrowing/borrowingApi';

export const Profile: React.FC = () => {
  const { data: profile, isLoading } = useGetMemberProfileQuery();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-sm" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{profile?.name || 'Alex Chen'}</h2>
            <p className="text-gray-500 mb-4">{profile?.faculty || 'Faculty of Computer & Information Science'}</p>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              {profile?.cardStatus || 'Valid thru Jul 2026'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Member ID</span>
                <span className="font-medium text-gray-900">{profile?.memberId || '#LIB-8841'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">alex.chen@university.edu</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Tier</span>
                <span className="font-medium text-gray-900">{profile?.tier || 'Graduate Research'}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Library Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Active Loans</span>
                <span className="font-medium text-blue-600">{profile?.quota.used || 3} / {profile?.quota.total || 5}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Outstanding Fines</span>
                <span className={`font-medium > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  ${profile?.fines.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Max Renewals</span>
                <span className="font-medium text-gray-900">{profile?.quota.maxRenewals || 2} per title</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};