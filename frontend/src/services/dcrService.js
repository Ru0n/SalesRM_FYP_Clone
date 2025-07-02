import api from './api';

/**
 * Get all daily call reports
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of daily call reports
 */
export const getDailyCallReports = async (params = {}) => {
  try {
    const response = await api.get('/reports/daily-call-reports/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific daily call report by ID
 * @param {number} id - Daily call report ID
 * @returns {Promise<Object>} - Daily call report details
 */
export const getDailyCallReportById = async (id) => {
  try {
    const response = await api.get(`/reports/daily-call-reports/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new daily call report
 * @param {Object} dcrData - Daily call report data
 * @returns {Promise<Object>} - Created daily call report
 */
export const createDailyCallReport = async (dcrData) => {
  try {
    const response = await api.post('/reports/daily-call-reports/', dcrData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a daily call report
 * @param {number} id - Daily call report ID
 * @param {Object} dcrData - Updated daily call report data
 * @returns {Promise<Object>} - Updated daily call report
 */
export const updateDailyCallReport = async (id, dcrData) => {
  try {
    const response = await api.patch(`/reports/daily-call-reports/${id}/`, dcrData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a daily call report
 * @param {number} id - Daily call report ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteDailyCallReport = async (id) => {
  try {
    const response = await api.delete(`/reports/daily-call-reports/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
