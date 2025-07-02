import api from './api';

/**
 * Get all tour programs
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of tour programs
 */
export const getTourPrograms = async (params = {}) => {
  try {
    const response = await api.get('/tours/tour-programs/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific tour program by ID
 * @param {number} id - Tour program ID
 * @returns {Promise<Object>} - Tour program details
 */
export const getTourProgramById = async (id) => {
  try {
    const response = await api.get(`/tours/tour-programs/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new tour program
 * @param {Object} tourProgramData - Tour program data
 * @returns {Promise<Object>} - Created tour program
 */
export const createTourProgram = async (tourProgramData) => {
  try {
    const response = await api.post('/tours/tour-programs/', tourProgramData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing tour program
 * @param {number} id - Tour program ID
 * @param {Object} tourProgramData - Updated tour program data
 * @returns {Promise<Object>} - Updated tour program
 */
export const updateTourProgram = async (id, tourProgramData) => {
  try {
    const response = await api.patch(`/tours/tour-programs/${id}/`, tourProgramData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a tour program for approval
 * @param {number} id - Tour program ID
 * @returns {Promise<Object>} - Submitted tour program
 */
export const submitTourProgram = async (id) => {
  try {
    const response = await api.post(`/tours/tour-programs/${id}/submit/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a tour program
 * @param {number} id - Tour program ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Approved tour program
 */
export const approveTourProgram = async (id, comments = '') => {
  try {
    const response = await api.post(`/tours/tour-programs/${id}/approve/`, { manager_comments: comments });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a tour program
 * @param {number} id - Tour program ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Rejected tour program
 */
export const rejectTourProgram = async (id, comments = '') => {
  try {
    const response = await api.post(`/tours/tour-programs/${id}/reject/`, { manager_comments: comments });
    return response.data;
  } catch (error) {
    throw error;
  }
};
