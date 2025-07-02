import api from './api';

/**
 * Get all leave types
 * @returns {Promise<Array>} - List of leave types
 */
export const getLeaveTypes = async () => {
  try {
    const response = await api.get('/leaves/leave-types/');
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all leave requests
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of leave requests
 */
export const getLeaveRequests = async (params = {}) => {
  try {
    const response = await api.get('/leaves/leave-requests/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific leave request by ID
 * @param {number} id - Leave request ID
 * @returns {Promise<Object>} - Leave request details
 */
export const getLeaveRequestById = async (id) => {
  try {
    const response = await api.get(`/leaves/leave-requests/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new leave request
 * @param {Object} leaveRequestData - Leave request data
 * @returns {Promise<Object>} - Created leave request
 */
export const createLeaveRequest = async (leaveRequestData) => {
  try {
    const response = await api.post('/leaves/leave-requests/', leaveRequestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a leave request
 * @param {number} id - Leave request ID
 * @param {Object} leaveRequestData - Updated leave request data
 * @returns {Promise<Object>} - Updated leave request
 */
export const updateLeaveRequest = async (id, leaveRequestData) => {
  try {
    const response = await api.patch(`/leaves/leave-requests/${id}/`, leaveRequestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel a leave request
 * @param {number} id - Leave request ID
 * @returns {Promise<Object>} - Cancelled leave request
 */
export const cancelLeaveRequest = async (id) => {
  try {
    const response = await api.post(`/leaves/leave-requests/${id}/cancel/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a leave request
 * @param {number} id - Leave request ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Approved leave request
 */
export const approveLeaveRequest = async (id, comments = '') => {
  try {
    const response = await api.post(`/leaves/leave-requests/${id}/approve/`, {
      manager_comments: comments
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a leave request
 * @param {number} id - Leave request ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Rejected leave request
 */
export const rejectLeaveRequest = async (id, comments = '') => {
  try {
    const response = await api.post(`/leaves/leave-requests/${id}/reject/`, {
      manager_comments: comments
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};