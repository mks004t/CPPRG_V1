import React from 'react';
import { FiDatabase, FiSettings, FiUsers, FiMapPin } from 'react-icons/fi';

const MDM: React.FC = () => {
  const modules = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage system users, roles, and permissions',
      icon: FiUsers,
      color: 'blue',
      items: ['Active Users: 156', 'Admin Users: 12', 'Pending Approvals: 3'],
    },
    {
      id: 'locations',
      title: 'Location Master',
      description: 'Maintain units, locations, and geographical data',
      icon: FiMapPin,
      color: 'green',
      items: ['Total Locations: 45', 'Active Units: 12', 'Regions: 4'],
    },
    {
      id: 'resources',
      title: 'Resource Catalog',
      description: 'Configure resource types, categories, and specifications',
      icon: FiDatabase,
      color: 'purple',
      items: ['Resource Types: 4', 'Active Items: 1,247', 'Categories: 28'],
    },
    {
      id: 'system',
      title: 'System Configuration',
      description: 'Application settings, workflows, and system parameters',
      icon: FiSettings,
      color: 'orange',
      items: ['Workflows: 8', 'Notifications: 24', 'Integrations: 6'],
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          icon: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
          hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          icon: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
          hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          icon: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800',
          hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-600',
          hover: 'hover:bg-gray-100 dark:hover:bg-gray-600',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Master Data Management (MDM)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure and manage system master data, user access, and application settings
        </p>
      </div>

      {/* MDM Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const colors = getColorClasses(module.color);
          const IconComponent = module.icon;

          return (
            <div
              key={module.id}
              className={`${colors.bg} ${colors.border} ${colors.hover} border rounded-lg p-6 cursor-pointer transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex items-start">
                <div className={`${colors.icon} mr-4 flex-shrink-0`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {module.description}
                  </p>
                  <div className="space-y-1">
                    {module.items.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <div className="h-1 w-1 bg-gray-400 rounded-full mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent MDM Activities
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                New user account created for John Smith
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                2 hours ago • User Management
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                Location "Site C - Building 3" added to system
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                5 hours ago • Location Master
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="h-2 w-2 bg-purple-400 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                Resource specifications updated for "Heavy Duty Cranes"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                1 day ago • Resource Catalog
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                Notification template modified for "Request Approved"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                2 days ago • System Configuration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
            <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Add User</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
            <FiMapPin className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Add Location</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
            <FiDatabase className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Add Resource</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors">
            <FiSettings className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MDM;