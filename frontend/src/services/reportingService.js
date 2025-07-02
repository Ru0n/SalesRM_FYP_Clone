import api from './api';

/**
 * Get DCR summary report data
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - DCR summary report data
 */
export const getDCRSummaryReport = async (params = {}) => {
  try {
    const response = await api.get('/reports/dcr-summary/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get expense summary report data
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Expense summary report data
 */
export const getExpenseSummaryReport = async (params = {}) => {
  try {
    const response = await api.get('/reports/expense-summary/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get leave summary report data
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Leave summary report data
 */
export const getLeaveSummaryReport = async (params = {}) => {
  try {
    const response = await api.get('/reports/leave-summary/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
