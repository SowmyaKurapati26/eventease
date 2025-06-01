import { getAuthToken } from '@/lib/auth';

const API_BASE_URL = 'http://localhost:5000/api';

// API utility function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const config: RequestInit = {
    method: 'GET', // Default method
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options, // This will override the default method if provided in options
  };

  // Debug log
  console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
  console.log('Request config:', {
    method: config.method,
    headers: config.headers,
    body: config.body
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export default apiRequest;
