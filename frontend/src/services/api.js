import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for dispatching actions
let store = null;

/**
 * Initialize the API with the Redux store
 * This allows the API to dispatch actions to update the Redux state
 * @param {Object} appStore - The Redux store
 */
export const initializeApi = (appStore) => {
  store = appStore;
};

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, handle logout
          handleAuthError();
          return Promise.reject(error);
        }

        // Try to refresh the token
        // Use a direct axios call instead of the api instance to avoid interceptors loop
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const { access } = response.data;

        // Save the new token
        localStorage.setItem('token', access);

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, handle logout
        console.error('Token refresh failed:', refreshError);

        // Check if the error is due to an invalid refresh token
        if (refreshError.response?.status === 401) {
          console.log('Invalid refresh token, logging out');
        }

        handleAuthError();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Handle authentication errors by clearing tokens and updating Redux state
 */
const handleAuthError = () => {
  // Clear tokens from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  // If store is initialized, dispatch logout action
  if (store) {
    const { logout } = require('../store/slices/authSlice');
    store.dispatch(logout());
  }

  // Redirect to login page
  // Use window.location for hard redirect to ensure clean state
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export default api;