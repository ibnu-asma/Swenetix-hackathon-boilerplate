// src/pages/student/Profile.tsx
import React, { useState } from 'react';
import { useGetMemberProfileQuery } from '../../features/borrowing/borrowingApi';
import { EditProfileModal } from '../../features/memebers/components/EditProfileModal';
 // Import the modal

export const Profile: React.FC = () => {
  const { data: profile, isLoading } = useGetMemberProfileQuery();
  
  // 1. Add state to control modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        
        {/* 2. Add the Edit Button */}
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-sm" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-gray-500 mb-4">{profile.faculty}</p>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              {profile.cardStatus}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Member ID</span>
                <span className="font-medium text-gray-900">{profile.memberId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{profile.email || 'alex.chen@university.edu'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Tier</span>
                <span className="font-medium text-gray-900">{profile.tier}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Library Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Active Loans</span>
                <span className="font-medium text-blue-600">{profile.quota.used} / {profile.quota.total}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Outstanding Fines</span>
                <span className={`font-medium ${profile.fines > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  ${profile.fines.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Max Renewals</span>
                <span className="font-medium text-gray-900">{profile.quota.maxRenewals} per title</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Render the Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={profile} 
      />
    </div>
  );
};