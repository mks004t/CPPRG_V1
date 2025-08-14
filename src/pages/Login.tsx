import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Logo and title */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">TS</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Resource Exchange Portal
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in with your Azure AD account
            </p>
          </div>

          {/* Sign in form */}
          <div className="mt-8">
            <button
              onClick={login}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiLogIn className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in (Development Mode)'}
            </button>
          </div>

          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Development Mode - Azure AD SSO temporarily disabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;