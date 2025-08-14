import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSend, FiChevronDown, FiChevronUp, FiCalendar, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  getJobDescriptions,
  getJobTypes,
  getLocations,
  getAreas,
  getUnits,
  getRopeTypes,
  getCraneTypes,
  getScaffoldingTypes,
  getRopeAccessTypes,
  getManpowerSkills,
  getManpowerSubSkills,
  getScaffoldingTeamTypes,
  getProviderLocations,
  getVendors,
  submitResourceRequest
} from '../api/resourceApi';

const ResourceRequestPage = () => {
  // Job Information State
  const [jobInfo, setJobInfo] = useState({
    jobDescription: '',
    jobType: '',
    jobStartDate: '',
    jobEndDate: '',
    requesterLocation: '',
    requesterAreaRel: '',
    requesterUnitRel: '',
    jobLocation: '',
    comment: ''
  });

  // Resource States
  const [ropeRequests, setRopeRequests] = useState([]);
  const [craneRequests, setCraneRequests] = useState([]);
  const [scaffoldingRequests, setScaffoldingRequests] = useState([]);
  const [ropeAccessRequests, setRopeAccessRequests] = useState([]);
  const [manpowerRequests, setManpowerRequests] = useState([]);
  const [scaffoldingTeamRequests, setScaffoldingTeamRequests] = useState([]);

  // Dropdown Options State
  const [dropdownOptions, setDropdownOptions] = useState({
    jobDescriptions: [],
    jobTypes: [],
    locations: [],
    areas: [],
    units: [],
    ropeTypes: [],
    craneTypes: [],
    scaffoldingTypes: [],
    ropeAccessTypes: [],
    manpowerSkills: [],
    manpowerSubSkills: [],
    scaffoldingTeamTypes: [],
    providerLocations: [],
    vendors: []
  });

  // UI State
  const [expandedSections, setExpandedSections] = useState({
    rope: false,
    crane: false,
    scaffolding: false,
    ropeAccess: false,
    manpower: false,
    scaffoldingTeam: false
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, type: '', message: '' });

  // Load initial dropdown data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load dependent dropdowns
  useEffect(() => {
    if (jobInfo.requesterLocation) {
      loadAreas(jobInfo.requesterLocation);
    } else {
      setJobInfo(prev => ({ ...prev, requesterAreaRel: '', requesterUnitRel: '' }));
      setDropdownOptions(prev => ({ ...prev, areas: [], units: [] }));
    }
  }, [jobInfo.requesterLocation]);

  useEffect(() => {
    if (jobInfo.requesterAreaRel) {
      loadUnits(jobInfo.requesterAreaRel);
    } else {
      setJobInfo(prev => ({ ...prev, requesterUnitRel: '' }));
      setDropdownOptions(prev => ({ ...prev, units: [] }));
    }
  }, [jobInfo.requesterAreaRel]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [
        jobDescriptions,
        jobTypes,
        locations,
        ropeTypes,
        craneTypes,
        scaffoldingTypes,
        ropeAccessTypes,
        manpowerSkills,
        scaffoldingTeamTypes,
        providerLocations
      ] = await Promise.all([
        getJobDescriptions(),
        getJobTypes(),
        getLocations(),
        getRopeTypes(),
        getCraneTypes(),
        getScaffoldingTypes(),
        getRopeAccessTypes(),
        getManpowerSkills(),
        getScaffoldingTeamTypes(),
        getProviderLocations()
      ]);

      setDropdownOptions(prev => ({
        ...prev,
        jobDescriptions: jobDescriptions.data || [],
        jobTypes: jobTypes.data || [],
        locations: locations.data || [],
        ropeTypes: ropeTypes.data || [],
        craneTypes: craneTypes.data || [],
        scaffoldingTypes: scaffoldingTypes.data || [],
        ropeAccessTypes: ropeAccessTypes.data || [],
        manpowerSkills: manpowerSkills.data || [],
        scaffoldingTeamTypes: scaffoldingTeamTypes.data || [],
        providerLocations: providerLocations.data || []
      }));
    } catch (error) {
      console.error('Failed to load initial data:', error);
      showAlertMessage('error', 'Failed to load form data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadAreas = async (locationId) => {
    try {
      const response = await getAreas(locationId);
      setDropdownOptions(prev => ({ ...prev, areas: response.data || [] }));
    } catch (error) {
      console.error('Failed to load areas:', error);
    }
  };

  const loadUnits = async (areaId) => {
    try {
      const response = await getUnits(areaId);
      setDropdownOptions(prev => ({ ...prev, units: response.data || [] }));
    } catch (error) {
      console.error('Failed to load units:', error);
    }
  };

  const loadManpowerSubSkills = async (skillId) => {
    try {
      const response = await getManpowerSubSkills(skillId);
      setDropdownOptions(prev => ({ ...prev, manpowerSubSkills: response.data || [] }));
    } catch (error) {
      console.error('Failed to load sub skills:', error);
    }
  };

  const showAlertMessage = (type, message) => {
    setShowAlert({ show: true, type, message });
    setTimeout(() => {
      setShowAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleJobInfoChange = (field, value) => {
    setJobInfo(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Resource row management functions
  const addResourceRow = (resourceType) => {
    const newRow = { id: Date.now() + Math.random() };
    
    switch (resourceType) {
      case 'rope':
        setRopeRequests(prev => [...prev, { ...newRow, ropeType: '', length: '', diameter: '', quantity: '', purpose: '' }]);
        break;
      case 'crane':
        setCraneRequests(prev => [...prev, { ...newRow, craneType: '', capacity: '', height: '', duration: '', operatorRequired: false }]);
        break;
      case 'scaffolding':
        setScaffoldingRequests(prev => [...prev, { ...newRow, scaffoldingType: '', area: '', height: '', duration: '', safetyRails: false }]);
        break;
      case 'ropeAccess':
        setRopeAccessRequests(prev => [...prev, { ...newRow, subType: '', quantity: '', providerLocation: '' }]);
        break;
      case 'manpower':
        setManpowerRequests(prev => [...prev, { ...newRow, skill: '', subSkill: '', vendor: '', location: '', ids: '', gatePass: false, skilledCount: 0, unskilledCount: 0 }]);
        break;
      case 'scaffoldingTeam':
        setScaffoldingTeamRequests(prev => [...prev, { ...newRow, subType: '', quantity: '', providerLocation: '' }]);
        break;
    }
  };

  const removeResourceRow = (resourceType, id) => {
    switch (resourceType) {
      case 'rope':
        setRopeRequests(prev => prev.filter(item => item.id !== id));
        break;
      case 'crane':
        setCraneRequests(prev => prev.filter(item => item.id !== id));
        break;
      case 'scaffolding':
        setScaffoldingRequests(prev => prev.filter(item => item.id !== id));
        break;
      case 'ropeAccess':
        setRopeAccessRequests(prev => prev.filter(item => item.id !== id));
        break;
      case 'manpower':
        setManpowerRequests(prev => prev.filter(item => item.id !== id));
        break;
      case 'scaffoldingTeam':
        setScaffoldingTeamRequests(prev => prev.filter(item => item.id !== id));
        break;
    }
  };

  const updateResourceRow = (resourceType, id, field, value) => {
    switch (resourceType) {
      case 'rope':
        setRopeRequests(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        break;
      case 'crane':
        setCraneRequests(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        break;
      case 'scaffolding':
        setScaffoldingRequests(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        break;
      case 'ropeAccess':
        setRopeAccessRequests(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        break;
      case 'manpower':
        setManpowerRequests(prev => prev.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            // Load sub skills when skill changes
            if (field === 'skill' && value) {
              loadManpowerSubSkills(value);
            }
            return updatedItem;
          }
          return item;
        }));
        break;
      case 'scaffoldingTeam':
        setScaffoldingTeamRequests(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
        break;
    }
  };

  const validateForm = () => {
    const requiredJobFields = ['jobDescription', 'jobType', 'jobStartDate', 'jobEndDate', 'requesterLocation', 'jobLocation'];
    
    for (const field of requiredJobFields) {
      if (!jobInfo[field]) {
        showAlertMessage('error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (new Date(jobInfo.jobStartDate) >= new Date(jobInfo.jobEndDate)) {
      showAlertMessage('error', 'Job end date must be after start date');
      return false;
    }

    const hasAnyResource = ropeRequests.length > 0 || craneRequests.length > 0 || 
                          scaffoldingRequests.length > 0 || ropeAccessRequests.length > 0 || 
                          manpowerRequests.length > 0 || scaffoldingTeamRequests.length > 0;

    if (!hasAnyResource) {
      showAlertMessage('error', 'Please add at least one resource request');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        jobInfo,
        resources: {
          rope: ropeRequests,
          crane: craneRequests,
          scaffolding: scaffoldingRequests,
          ropeAccess: ropeAccessRequests,
          manpower: manpowerRequests,
          scaffoldingTeam: scaffoldingTeamRequests
        }
      };

      const response = await submitResourceRequest(payload);
      
      showAlertMessage('success', `Request submitted successfully! Request ID: ${response.data.requestId}`);
      
      // Reset form
      setJobInfo({
        jobDescription: '',
        jobType: '',
        jobStartDate: '',
        jobEndDate: '',
        requesterLocation: '',
        requesterAreaRel: '',
        requesterUnitRel: '',
        jobLocation: '',
        comment: ''
      });
      
      setRopeRequests([]);
      setCraneRequests([]);
      setScaffoldingRequests([]);
      setRopeAccessRequests([]);
      setManpowerRequests([]);
      setScaffoldingTeamRequests([]);
      
      setExpandedSections({
        rope: false,
        crane: false,
        scaffolding: false,
        ropeAccess: false,
        manpower: false,
        scaffoldingTeam: false
      });

    } catch (error) {
      console.error('Submit failed:', error);
      showAlertMessage('error', 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelect = (value, onChange, options, placeholder, required = false) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id || option.value || option} value={option.id || option.value || option}>
          {option.name || option.label || option}
        </option>
      ))}
    </select>
  );

  const renderInput = (value, onChange, placeholder, type = 'text', required = false) => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      required={required}
    />
  );

  const renderCheckbox = (checked, onChange, label) => (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );

  const renderResourceSection = (title, resourceType, requests, fields) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => toggleSection(resourceType)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          {requests.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {requests.length} item{requests.length !== 1 ? 's' : ''}
            </span>
          )}
          {expandedSections[resourceType] ? (
            <FiChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <FiChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>

      {expandedSections[resourceType] && (
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add and configure {title.toLowerCase()} requirements
            </p>
            <button
              type="button"
              onClick={() => addResourceRow(resourceType)}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              <FiPlus className="h-4 w-4 mr-1" />
              Add Row
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No {title.toLowerCase()} requests added. Click "Add Row" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {title} Request {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeResourceRow(resourceType, request.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-md transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {field.label} {field.required && '*'}
                        </label>
                        {field.type === 'select' && renderSelect(
                          request[field.key],
                          (value) => updateResourceRow(resourceType, request.id, field.key, value),
                          field.options || [],
                          field.placeholder,
                          field.required
                        )}
                        {field.type === 'input' && renderInput(
                          request[field.key],
                          (value) => updateResourceRow(resourceType, request.id, field.key, value),
                          field.placeholder,
                          field.inputType || 'text',
                          field.required
                        )}
                        {field.type === 'checkbox' && renderCheckbox(
                          request[field.key],
                          (value) => updateResourceRow(resourceType, request.id, field.key, value),
                          field.label
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {showAlert.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg ${
          showAlert.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            {showAlert.type === 'success' ? (
              <FiCheck className="h-5 w-5 mr-2" />
            ) : (
              <FiX className="h-5 w-5 mr-2" />
            )}
            <span className="text-sm font-medium">{showAlert.message}</span>
            <button
              onClick={() => setShowAlert({ show: false, type: '', message: '' })}
              className="ml-auto pl-3"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Job Information Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Resource Request Form
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Job Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description *
            </label>
            {renderSelect(
              jobInfo.jobDescription,
              (value) => handleJobInfoChange('jobDescription', value),
              dropdownOptions.jobDescriptions,
              'Select job description...',
              true
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Type *
            </label>
            {renderSelect(
              jobInfo.jobType,
              (value) => handleJobInfoChange('jobType', value),
              dropdownOptions.jobTypes,
              'Select job type...',
              true
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Start Date *
            </label>
            {renderInput(
              jobInfo.jobStartDate,
              (value) => handleJobInfoChange('jobStartDate', value),
              '',
              'date',
              true
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job End Date *
            </label>
            {renderInput(
              jobInfo.jobEndDate,
              (value) => handleJobInfoChange('jobEndDate', value),
              '',
              'date',
              true
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requester Location *
            </label>
            {renderSelect(
              jobInfo.requesterLocation,
              (value) => handleJobInfoChange('requesterLocation', value),
              dropdownOptions.locations,
              'Select location...',
              true
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requester Area Rel.
            </label>
            {renderSelect(
              jobInfo.requesterAreaRel,
              (value) => handleJobInfoChange('requesterAreaRel', value),
              dropdownOptions.areas,
              'Select area...'
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requester Unit Rel.
            </label>
            {renderSelect(
              jobInfo.requesterUnitRel,
              (value) => handleJobInfoChange('requesterUnitRel', value),
              dropdownOptions.units,
              'Select unit...'
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Location *
            </label>
            {renderInput(
              jobInfo.jobLocation,
              (value) => handleJobInfoChange('jobLocation', value),
              'Enter job location',
              'text',
              true
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment
            </label>
            <textarea
              value={jobInfo.comment}
              onChange={(e) => handleJobInfoChange('comment', e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter any additional comments"
            />
          </div>
        </div>
      </div>

      {/* Resource Request Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Resource Requirements
        </h2>

        {/* Rope Section */}
        {renderResourceSection('Rope', 'rope', ropeRequests, [
          { key: 'ropeType', label: 'Rope Type', type: 'select', options: dropdownOptions.ropeTypes, placeholder: 'Select rope type...', required: true },
          { key: 'length', label: 'Length (M)', type: 'input', inputType: 'number', placeholder: 'Enter length', required: true },
          { key: 'diameter', label: 'Diameter (MM)', type: 'input', inputType: 'number', placeholder: 'Enter diameter', required: true },
          { key: 'quantity', label: 'Quantity', type: 'input', inputType: 'number', placeholder: 'Enter quantity', required: true },
          { key: 'purpose', label: 'Purpose', type: 'input', placeholder: 'Enter purpose', required: true }
        ])}

        {/* Crane Section */}
        {renderResourceSection('Crane', 'crane', craneRequests, [
          { key: 'craneType', label: 'Crane Type', type: 'select', options: dropdownOptions.craneTypes, placeholder: 'Select crane type...', required: true },
          { key: 'capacity', label: 'Capacity (Tons)', type: 'input', inputType: 'number', placeholder: 'Enter capacity', required: true },
          { key: 'height', label: 'Height (M)', type: 'input', inputType: 'number', placeholder: 'Enter height', required: true },
          { key: 'duration', label: 'Duration (Hours)', type: 'input', inputType: 'number', placeholder: 'Enter duration', required: true },
          { key: 'operatorRequired', label: 'Operator Required', type: 'checkbox' }
        ])}

        {/* Scaffolding Section */}
        {renderResourceSection('Scaffolding', 'scaffolding', scaffoldingRequests, [
          { key: 'scaffoldingType', label: 'Scaffolding Type', type: 'select', options: dropdownOptions.scaffoldingTypes, placeholder: 'Select scaffolding type...', required: true },
          { key: 'area', label: 'Area (SQ M)', type: 'input', inputType: 'number', placeholder: 'Enter area', required: true },
          { key: 'height', label: 'Height (M)', type: 'input', inputType: 'number', placeholder: 'Enter height', required: true },
          { key: 'duration', label: 'Duration (Days)', type: 'input', inputType: 'number', placeholder: 'Enter duration', required: true },
          { key: 'safetyRails', label: 'Safety Rails', type: 'checkbox' }
        ])}

        {/* Rope Access Section */}
        {renderResourceSection('Rope Access', 'ropeAccess', ropeAccessRequests, [
          { key: 'subType', label: 'Sub Type', type: 'select', options: dropdownOptions.ropeAccessTypes, placeholder: 'Select sub type...', required: true },
          { key: 'quantity', label: 'Quantity', type: 'input', inputType: 'number', placeholder: 'Enter quantity', required: true },
          { key: 'providerLocation', label: 'Provider Location', type: 'select', options: dropdownOptions.providerLocations, placeholder: 'Select provider location...', required: true }
        ])}

        {/* Manpower Section */}
        {renderResourceSection('Manpower', 'manpower', manpowerRequests, [
          { key: 'skill', label: 'Skill', type: 'select', options: dropdownOptions.manpowerSkills, placeholder: 'Select skill...', required: true },
          { key: 'subSkill', label: 'Sub Skill', type: 'select', options: dropdownOptions.manpowerSubSkills, placeholder: 'Select sub skill...', required: true },
          { key: 'vendor', label: 'Vendor', type: 'input', placeholder: 'Enter vendor', required: true },
          { key: 'location', label: 'Location', type: 'input', placeholder: 'Enter location', required: true },
          { key: 'ids', label: 'IDs', type: 'input', placeholder: 'Enter ID details' },
          { key: 'gatePass', label: 'Gate Pass', type: 'checkbox' },
          { key: 'skilledCount', label: 'Skilled Count', type: 'input', inputType: 'number', placeholder: 'Enter skilled count' },
          { key: 'unskilledCount', label: 'Unskilled Count', type: 'input', inputType: 'number', placeholder: 'Enter unskilled count' }
        ])}

        {/* Scaffolding Team Section */}
        {renderResourceSection('Scaffolding Team', 'scaffoldingTeam', scaffoldingTeamRequests, [
          { key: 'subType', label: 'Sub Type', type: 'select', options: dropdownOptions.scaffoldingTeamTypes, placeholder: 'Select sub type...', required: true },
          { key: 'quantity', label: 'Quantity', type: 'input', inputType: 'number', placeholder: 'Enter quantity', required: true },
          { key: 'providerLocation', label: 'Provider Location', type: 'select', options: dropdownOptions.providerLocations, placeholder: 'Select provider location...', required: true }
        ])}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
        >
          <FiSend className="h-5 w-5 mr-2" />
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </div>
  );
};

export default ResourceRequestPage;