import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiCheckSquare, FiDatabase, FiX } from 'react-icons/fi';
import { useSidebar } from '../../context/SidebarContext';
import clsx from 'clsx';

const menuItems = [
  { path: '/', icon: FiHome, label: 'Home' },
  { path: '/request', icon: FiFileText, label: 'Request' },
  { path: '/resource-request', icon: FiFileText, label: 'Resource Request' },
  { path: '/my-action', icon: FiCheckSquare, label: 'My Action' },
  { path: '/mdm', icon: FiDatabase, label: 'MDM' },
];

const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0',
          {
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
          }
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">TS</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              Menu
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      {
                        'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300':
                          isActive,
                        'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white':
                          !isActive,
                      }
                    )
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;