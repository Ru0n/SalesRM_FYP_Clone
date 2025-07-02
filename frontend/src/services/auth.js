import api from './api';

/**
 * Authenticate user and get tokens
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Authentication data including tokens and user data
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/token/', { email, password });
    const { access, refresh, user } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);

    return { access, refresh, user };
  } catch (error) {
    throw error;
  }
};

/**
 * Log out the current user by removing tokens
 */
export const logout = () => {
  // Remove tokens from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

/**
 * Get the current authenticated user's information
 * @returns {Promise<Object>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if a user is currently authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Manually refresh the access token using the refresh token
 * @returns {Promise<string>} - New access token
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Use axios directly to avoid interceptors
    const axios = require('axios').default;
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const { access } = response.data;

    // Store the new token
    localStorage.setItem('token', access);

    return access;
  } catch (error) {
    // Clear tokens if refresh fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};