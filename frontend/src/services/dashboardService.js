import api from './api';

/**
 * Get dashboard data
 * @returns {Promise<Object>} - Dashboard data
 */
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
