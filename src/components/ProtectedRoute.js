import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute check:', { user, loading, hasUser: !!user });

  // CRITICAL: Always show loading first to prevent flash of unprotected content
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // CRITICAL: If no user OR user is invalid, ALWAYS show login
  // Never allow bypass - security first!
  if (!user || !user.uid || !user.email) {
    console.log('❌ No valid user found - showing login (Security: No bypass allowed)');
    return <Login />;
  }

  console.log('✅ User authenticated - showing app');
  // If authenticated with valid user, show the protected content
  return children;
};

export default ProtectedRoute; 