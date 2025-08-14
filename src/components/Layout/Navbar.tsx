import React, { useState } from 'react';
import { FiUser, FiSun, FiMoon, FiLogOut, FiMenu, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, isAutoMode, setAutoMode } = useTheme();
  const { toggleSidebar } = useSidebar();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 md:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-4 md:ml-0">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">TS</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resource Exchange Portal
                </h1>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FiUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Theme toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <FiMoon className="h-5 w-5" />
                ) : (
                  <FiSun className="h-5 w-5" />
                )}
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setAutoMode(true);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        isAutoMode
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FiSettings className="inline h-4 w-4 mr-2" />
                      Auto (Time-based)
                    </button>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowThemeMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {isDarkMode ? (
                        <>
                          <FiSun className="inline h-4 w-4 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <FiMoon className="inline h-4 w-4 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for theme menu */}
      {showThemeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowThemeMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;