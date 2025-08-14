import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Job Information APIs
export const getJobDescriptions = () => apiClient.get('/api/job-descriptions');
export const getJobTypes = () => apiClient.get('/api/job-types');
export const getLocations = () => apiClient.get('/api/locations');
export const getAreas = (locationId) => apiClient.get(`/api/areas?locationId=${locationId}`);
export const getUnits = (areaId) => apiClient.get(`/api/units?areaId=${areaId}`);

// Resource-specific APIs
export const getRopeTypes = () => apiClient.get('/api/rope-types');
export const getCraneTypes = () => apiClient.get('/api/crane-types');
export const getScaffoldingTypes = () => apiClient.get('/api/scaffolding-types');
export const getRopeAccessTypes = () => apiClient.get('/api/rope-access-types');
export const getManpowerSkills = () => apiClient.get('/api/manpower-skills');
export const getManpowerSubSkills = (skillId) => apiClient.get(`/api/manpower-sub-skills?skillId=${skillId}`);
export const getScaffoldingTeamTypes = () => apiClient.get('/api/scaffolding-team-types');

// Provider and Vendor APIs
export const getProviderLocations = () => apiClient.get('/api/provider-locations');
export const getVendors = (resourceType) => apiClient.get(`/api/vendors?resourceType=${resourceType}`);

// Submit request
export const submitResourceRequest = (payload) => apiClient.post('/api/resource-request', payload);