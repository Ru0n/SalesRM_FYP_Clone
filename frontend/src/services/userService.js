import api from './api';

/**
 * Get all users
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of users
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/users/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} - User details
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get the current user
 * @returns {Promise<Object>} - Current user details
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
