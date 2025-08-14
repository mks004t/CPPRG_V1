import React, { useState } from 'react';
import { FiPackage } from 'react-icons/fi';

interface ResourceCard {
  id: string;
  name: string;
  image: string;
  description: string;
}

const resourceTypes: ResourceCard[] = [
  {
    id: 'rope',
    name: 'Rope',
    image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Industrial ropes and rigging equipment'
  },
  {
    id: 'crane',
    name: 'Crane',
    image: 'https://images.pexels.com/photos/162564/crane-construction-site-build-162564.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Heavy lifting and construction cranes'
  },
  {
    id: 'scaffolding',
    name: 'Scaffolding',
    image: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Temporary structures and platforms'
  },
  {
    id: 'manpower',
    name: 'Manpower',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Skilled workforce and contractors'
  },
];

const Home: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState('manpower');

  const selectedResourceData = resourceTypes.find(r => r.id === selectedResource);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Resource Exchange Portal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a resource type to view and manage your requests
        </p>
      </div>

      {/* Resource selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resourceTypes.map((resource) => (
          <div
            key={resource.id}
            onClick={() => setSelectedResource(resource.id)}
            className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all duration-300 transform hover:scale-105 ${
              selectedResource === resource.id
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={resource.image}
                alt={resource.name}
                className="w-full h-32 object-cover"
              />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white text-center">
                {resource.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                {resource.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected resource dashboard */}
      {selectedResourceData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <FiPackage className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedResourceData.name} Dashboard
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick stats */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Active Requests
              </h3>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">12</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                Completed
              </h3>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">45</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1">
                Pending Actions
              </h3>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">8</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Request REQ-2024-001 approved and released
                </span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  New request REQ-2024-002 submitted for review
                </span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="h-2 w-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  REQ-2024-003 requires your action
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;