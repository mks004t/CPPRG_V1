import React, { useState, useCallback } from 'react';
import { FiPlus, FiTrash2, FiSend, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { RequestFormData, ServiceSection, ServiceItem, SubmitRequest, ProviderPerson } from '../types/request';

// Mock data for dropdowns
const jobDescriptions = [
  'Maintenance Work',
  'Construction Project',
  'Inspection Activity',
  'Emergency Repair',
  'Installation Work'
];

const locations = [
  'Plant A - Building 1',
  'Plant A - Building 2',
  'Plant B - Building 1',
  'Plant C - Warehouse',
  'Site D - Construction Area'
];

const departments = [
  'Mechanical',
  'Electrical',
  'Civil',
  'Production',
  'Maintenance',
  'Safety'
];

const providerLocations = [
  'Central Store',
  'Plant A Store',
  'Plant B Store',
  'External Vendor',
  'Contractor Facility'
];

const providerHeads = [
  { id: '1', name: 'John Smith', type: 'FE', department: 'Mechanical' },
  { id: '2', name: 'Sarah Johnson', type: 'EE', department: 'Electrical' },
  { id: '3', name: 'Mike Wilson', type: 'ME', department: 'Mechanical' },
  { id: '4', name: 'Lisa Brown', type: 'MEC', department: 'Mechanical' },
  { id: '5', name: 'David Lee', type: 'FE', department: 'Civil' },
  { id: '6', name: 'Emma Davis', type: 'EE', department: 'Electrical' }
];

const serviceTypes = [
  { id: 'scaffolding', label: 'Scaffolding' },
  { id: 'rope-access', label: 'Rope Access' },
  { id: 'crane', label: 'Crane' },
  { id: 'manpower', label: 'Manpower' },
  { id: 'scaffolding-team', label: 'Scaffolding Team' }
];

const subTypes = {
  scaffolding: ['Standard Scaffolding', 'Mobile Scaffolding', 'Suspended Scaffolding'],
  'rope-access': ['Single Rope', 'Double Rope', 'Safety Rope'],
  crane: ['Mobile Crane', 'Tower Crane', 'Overhead Crane'],
  manpower: ['Skilled Worker', 'Semi-skilled Worker', 'Unskilled Worker'],
  'scaffolding-team': ['Installation Team', 'Dismantling Team', 'Inspection Team']
};

const vendors = {
  scaffolding: ['Scaff Corp', 'Build Safe', 'Steel Frame Ltd'],
  'rope-access': ['Rope Masters', 'Access Solutions', 'Height Safety Co'],
  crane: ['Crane Services Inc', 'Heavy Lift Co', 'Mobile Crane Rental'],
  manpower: ['Labor Solutions', 'Skilled Workforce', 'Contract Staff'],
  'scaffolding-team': ['Team Scaff', 'Professional Builders', 'Expert Assembly']
};

const skills = [
  'Welding',
  'Electrical Work',
  'Mechanical Fitting',
  'Painting',
  'Carpentry',
  'Plumbing',
  'Heavy Equipment Operation'
];

const subSkills = {
  'Welding': ['Arc Welding', 'Gas Welding', 'TIG Welding', 'MIG Welding'],
  'Electrical Work': ['Wiring', 'Panel Installation', 'Motor Repair', 'Lighting'],
  'Mechanical Fitting': ['Pipe Fitting', 'Valve Installation', 'Bearing Replacement'],
  'Painting': ['Surface Preparation', 'Spray Painting', 'Brush Painting'],
  'Carpentry': ['Formwork', 'Finishing', 'Structural Work'],
  'Plumbing': ['Installation', 'Repair', 'Maintenance'],
  'Heavy Equipment Operation': ['Crane Operation', 'Excavator', 'Forklift']
};

// Mock provider persons data
const mockProviderPersons: { [key: string]: ProviderPerson[] } = {
  '1': [
    { id: '1', pNumber: 'P001', name: 'Alex Johnson' },
    { id: '2', pNumber: 'P002', name: 'Maria Garcia' }
  ],
  '2': [
    { id: '3', pNumber: 'P003', name: 'Robert Chen' },
    { id: '4', pNumber: 'P004', name: 'Jennifer Wilson' }
  ],
  '3': [
    { id: '5', pNumber: 'P005', name: 'Michael Brown' },
    { id: '6', pNumber: 'P006', name: 'Sarah Davis' }
  ],
  '4': [
    { id: '7', pNumber: 'P007', name: 'David Miller' }
  ],
  '5': [
    { id: '8', pNumber: 'P008', name: 'Lisa Anderson' },
    { id: '9', pNumber: 'P009', name: 'James Taylor' }
  ],
  '6': [
    { id: '10', pNumber: 'P010', name: 'Emily White' }
  ]
};

const Request: React.FC = () => {
  const [formData, setFormData] = useState<RequestFormData>({
    jobDescription: '',
    jobStartDate: '',
    location: '',
    requesterName: '',
    requesterId: '',
    requesterDept: '',
    requesterComment: '',
  });

  const [services, setServices] = useState<ServiceSection[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [showDropdowns, setShowDropdowns] = useState<{ [key: string]: boolean }>({});

  const handleFormChange = (field: keyof RequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleServiceType = (serviceType: string) => {
    if (selectedServiceTypes.includes(serviceType)) {
      // Remove service type
      setSelectedServiceTypes(prev => prev.filter(type => type !== serviceType));
      setServices(prev => prev.filter(section => section.type !== serviceType));
    } else {
      // Add service type
      setSelectedServiceTypes(prev => [...prev, serviceType]);
      setServices(prev => [...prev, { type: serviceType as ServiceSection['type'], items: [] }]);
    }
  };

  const addServiceItem = useCallback((serviceType: ServiceSection['type']) => {
    const newItem: ServiceItem = {
      id: `${serviceType}_${Date.now()}_${Math.random()}`,
      subType: '',
      quantity: '',
      providerLocation: '',
      providerHead: '',
      providerPersons: [],
      vendor: '',
    };

    // Add manpower specific fields
    if (serviceType === 'manpower') {
      newItem.skill = '';
      newItem.subSkill = '';
      newItem.workLocation = '';
      newItem.idDetails = '';
      newItem.activeGatePass = 'No';
      newItem.skilledPersons = 0;
      newItem.unskilledPersons = 0;
    }

    setServices(prev =>
      prev.map(section =>
        section.type === serviceType
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    );
  }, []);

  const removeServiceItem = useCallback((serviceType: ServiceSection['type'], itemId: string) => {
    setServices(prev =>
      prev.map(section =>
        section.type === serviceType
          ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      )
    );
  }, []);

  const updateServiceItem = useCallback((
    serviceType: ServiceSection['type'],
    itemId: string,
    field: string,
    value: any
  ) => {
    setServices(prev =>
      prev.map(section =>
        section.type === serviceType
          ? {
              ...section,
              items: section.items.map(item => {
                if (item.id === itemId) {
                  const updatedItem = { ...item, [field]: value };
                  
                  // Auto-populate provider persons when provider head changes
                  if (field === 'providerHead' && value) {
                    updatedItem.providerPersons = mockProviderPersons[value] || [];
                  }
                  
                  return updatedItem;
                }
                return item;
              }),
            }
          : section
      )
    );
  }, []);

  const updateProviderPerson = useCallback((
    serviceType: ServiceSection['type'],
    itemId: string,
    personIndex: number,
    field: 'pNumber' | 'name',
    value: string
  ) => {
    setServices(prev =>
      prev.map(section =>
        section.type === serviceType
          ? {
              ...section,
              items: section.items.map(item => {
                if (item.id === itemId) {
                  const updatedPersons = [...item.providerPersons];
                  updatedPersons[personIndex] = {
                    ...updatedPersons[personIndex],
                    [field]: value
                  };
                  return { ...item, providerPersons: updatedPersons };
                }
                return item;
              }),
            }
          : section
      )
    );
  }, []);

  const validateForm = (): boolean => {
    const requiredFields = [
      'jobDescription',
      'jobStartDate',
      'location',
      'requesterName',
      'requesterId',
      'requesterDept',
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof RequestFormData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (services.length === 0) {
      toast.error('Please select at least one service type');
      return false;
    }

    const hasAnyItems = services.some(section => section.items.length > 0);
    if (!hasAnyItems) {
      toast.error('Please add at least one service item');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: SubmitRequest = {
        formData,
        services: services.filter(section => section.items.length > 0),
      };

      const response = await axios.post('/api/request/submit', submitData);
      const { requestId } = response.data;

      toast.success(`Request submitted successfully! ID: ${requestId}`);
      
      // Reset form
      setFormData({
        jobDescription: '',
        jobStartDate: '',
        location: '',
        requesterName: '',
        requesterId: '',
        requesterDept: '',
        requesterComment: '',
      });
      
      setServices([]);
      setSelectedServiceTypes([]);
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProviderHeads = (searchTerm: string, filterType?: string) => {
    return providerHeads.filter(head => {
      const matchesSearch = head.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterType || head.type === filterType;
      return matchesSearch && matchesFilter;
    });
  };

  const renderSearchableDropdown = (
    value: string,
    onChange: (value: string) => void,
    options: any[],
    placeholder: string,
    searchKey: string,
    displayField: string = 'name'
  ) => {
    const searchTerm = searchTerms[searchKey] || '';
    const isOpen = showDropdowns[searchKey] || false;
    
    const filteredOptions = options.filter(option => 
      (typeof option === 'string' ? option : option[displayField])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerms(prev => ({ ...prev, [searchKey]: e.target.value }))}
            onFocus={() => setShowDropdowns(prev => ({ ...prev, [searchKey]: true }))}
            placeholder={placeholder}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowDropdowns(prev => ({ ...prev, [searchKey]: !isOpen }))}
            className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500"
          >
            <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400">No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const selectedValue = typeof option === 'string' ? option : option.id;
                    const displayValue = typeof option === 'string' ? option : option[displayField];
                    onChange(selectedValue);
                    setSearchTerms(prev => ({ ...prev, [searchKey]: displayValue }));
                    setShowDropdowns(prev => ({ ...prev, [searchKey]: false }));
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {typeof option === 'string' ? option : (
                    <div>
                      <div className="font-medium">{option[displayField]}</div>
                      {option.type && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {option.type} - {option.department}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderServiceSection = (section: ServiceSection) => {
    const serviceLabel = serviceTypes.find(type => type.id === section.type)?.label || section.type;

    return (
      <div key={section.type} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {serviceLabel}
          </h3>
          <button
            onClick={() => addServiceItem(section.type)}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            <FiPlus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>

        {section.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items added. Click "Add Item" to get started.
          </div>
        ) : (
          <div className="space-y-6">
            {section.items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Item {index + 1}
                  </h4>
                  <button
                    onClick={() => removeServiceItem(section.type, item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-md transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sub Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sub Type *
                    </label>
                    <select
                      value={item.subType}
                      onChange={(e) => updateServiceItem(section.type, item.id, 'subType', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select sub type...</option>
                      {subTypes[section.type]?.map((subType) => (
                        <option key={subType} value={subType}>
                          {subType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity/Item *
                    </label>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateServiceItem(section.type, item.id, 'quantity', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter quantity"
                    />
                  </div>

                  {/* Provider Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider Location *
                    </label>
                    <select
                      value={item.providerLocation}
                      onChange={(e) => updateServiceItem(section.type, item.id, 'providerLocation', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select location...</option>
                      {providerLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Provider Head */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider Head *
                    </label>
                    {renderSearchableDropdown(
                      item.providerHead,
                      (value) => updateServiceItem(section.type, item.id, 'providerHead', value),
                      providerHeads,
                      'Search provider head...',
                      `providerHead_${item.id}`
                    )}
                  </div>

                  {/* Vendor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vendor *
                    </label>
                    <select
                      value={item.vendor}
                      onChange={(e) => updateServiceItem(section.type, item.id, 'vendor', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select vendor...</option>
                      {vendors[section.type]?.map((vendor) => (
                        <option key={vendor} value={vendor}>
                          {vendor}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manpower specific fields */}
                  {section.type === 'manpower' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skill *
                        </label>
                        {renderSearchableDropdown(
                          item.skill || '',
                          (value) => updateServiceItem(section.type, item.id, 'skill', value),
                          skills,
                          'Search skill...',
                          `skill_${item.id}`
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sub Skill *
                        </label>
                        <select
                          value={item.subSkill || ''}
                          onChange={(e) => updateServiceItem(section.type, item.id, 'subSkill', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select sub skill...</option>
                          {item.skill && subSkills[item.skill as keyof typeof subSkills]?.map((subSkill) => (
                            <option key={subSkill} value={subSkill}>
                              {subSkill}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Work Location
                        </label>
                        <input
                          type="text"
                          value={item.workLocation || ''}
                          onChange={(e) => updateServiceItem(section.type, item.id, 'workLocation', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter work location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ID Details
                        </label>
                        <input
                          type="text"
                          value={item.idDetails || ''}
                          onChange={(e) => updateServiceItem(section.type, item.id, 'idDetails', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter ID details"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Active Gate Pass
                        </label>
                        <select
                          value={item.activeGatePass || 'No'}
                          onChange={(e) => updateServiceItem(section.type, item.id, 'activeGatePass', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          No. of Skilled Persons
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.skilledPersons || 0}
                          onChange={(e) => updateServiceItem(section.type, item.id, 'skilledPersons', parseInt(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          No. of Unskilled Persons
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.unskilledPersons || 0}
                          onChange={(e) => updateServiceItem(section.type, item.id, 'unskilledPersons', parseInt(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Provider Persons */}
                {item.providerPersons.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      P. Number & Name {section.type === 'manpower' ? '(Editable)' : '(View Only)'}
                    </label>
                    <div className="space-y-2">
                      {item.providerPersons.map((person, personIndex) => (
                        <div key={person.id} className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={person.pNumber}
                            onChange={(e) => section.type === 'manpower' && updateProviderPerson(section.type, item.id, personIndex, 'pNumber', e.target.value)}
                            readOnly={section.type !== 'manpower'}
                            className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white ${
                              section.type === 'manpower' 
                                ? 'bg-white dark:bg-gray-700' 
                                : 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
                            }`}
                            placeholder="P. Number"
                          />
                          <input
                            type="text"
                            value={person.name}
                            onChange={(e) => section.type === 'manpower' && updateProviderPerson(section.type, item.id, personIndex, 'name', e.target.value)}
                            readOnly={section.type !== 'manpower'}
                            className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white ${
                              section.type === 'manpower' 
                                ? 'bg-white dark:bg-gray-700' 
                                : 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
                            }`}
                            placeholder="Name"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Submit New Request
        </h1>

        {/* General Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            General Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <select
                value={formData.jobDescription}
                onChange={(e) => handleFormChange('jobDescription', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select job description...</option>
                {jobDescriptions.map((desc) => (
                  <option key={desc} value={desc}>
                    {desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Start Date *
              </label>
              <input
                type="date"
                value={formData.jobStartDate}
                onChange={(e) => handleFormChange('jobStartDate', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select location...</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requester Name *
              </label>
              <input
                type="text"
                value={formData.requesterName}
                onChange={(e) => handleFormChange('requesterName', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter requester name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requester ID *
              </label>
              <input
                type="text"
                value={formData.requesterId}
                onChange={(e) => handleFormChange('requesterId', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter requester ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requester Department *
              </label>
              <select
                value={formData.requesterDept}
                onChange={(e) => handleFormChange('requesterDept', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select department...</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requester Comment
              </label>
              <textarea
                value={formData.requesterComment}
                onChange={(e) => handleFormChange('requesterComment', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter any additional comments"
              />
            </div>
          </div>
        </div>

        {/* Service Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Service Types
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {serviceTypes.map((serviceType) => (
              <button
                key={serviceType.id}
                onClick={() => toggleServiceType(serviceType.id)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  selectedServiceTypes.includes(serviceType.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{serviceType.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service sections */}
      {services.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Service Requirements
          </h2>
          {services.map(renderServiceSection)}
        </div>
      )}

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
        >
          <FiSend className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>

      {/* Backdrop for dropdowns */}
      {Object.values(showDropdowns).some(Boolean) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdowns({})}
        />
      )}
    </div>
  );
};

export default Request;