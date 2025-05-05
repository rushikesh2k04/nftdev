import React from 'react';
import { useWallet } from '../context/WalletContext';
import { User, Wallet } from 'lucide-react';

const Profile: React.FC = () => {
  const { state: { address, isConnected } } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            <p className="text-sm text-gray-500">Manage your account details and preferences</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
            <div className="mt-1 flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md flex-1">{address}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Status</label>
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
              Active
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Quick Access</h2>
        <p className="text-sm text-gray-600 mb-4">
          Access medical services and manage your data from the Medical Services page
        </p>
        <a
          href="/medical-services"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          Go to Medical Services
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Profile;