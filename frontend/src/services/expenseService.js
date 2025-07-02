import api from './api';

/**
 * Get all expense types
 * @returns {Promise<Array>} - List of expense types
 */
export const getExpenseTypes = async () => {
  try {
    const response = await api.get('/expenses/expense-types/');
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all expense claims
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of expense claims
 */
export const getExpenseClaims = async (params = {}) => {
  try {
    const response = await api.get('/expenses/expense-claims/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific expense claim by ID
 * @param {number} id - Expense claim ID
 * @returns {Promise<Object>} - Expense claim details
 */
export const getExpenseClaimById = async (id) => {
  try {
    const response = await api.get(`/expenses/expense-claims/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new expense claim
 * @param {Object} expenseClaimData - Expense claim data
 * @returns {Promise<Object>} - Created expense claim
 */
export const createExpenseClaim = async (expenseClaimData) => {
  try {
    // Handle file uploads with FormData
    const formData = new FormData();
    
    // Add all fields to the form data
    Object.keys(expenseClaimData).forEach(key => {
      if (key === 'attachment' && expenseClaimData[key]) {
        formData.append(key, expenseClaimData[key]);
      } else if (expenseClaimData[key] !== null && expenseClaimData[key] !== undefined) {
        formData.append(key, expenseClaimData[key]);
      }
    });
    
    const response = await api.post('/expenses/expense-claims/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an expense claim
 * @param {number} id - Expense claim ID
 * @param {Object} expenseClaimData - Updated expense claim data
 * @returns {Promise<Object>} - Updated expense claim
 */
export const updateExpenseClaim = async (id, expenseClaimData) => {
  try {
    // Handle file uploads with FormData
    const formData = new FormData();
    
    // Add all fields to the form data
    Object.keys(expenseClaimData).forEach(key => {
      if (key === 'attachment' && expenseClaimData[key]) {
        formData.append(key, expenseClaimData[key]);
      } else if (expenseClaimData[key] !== null && expenseClaimData[key] !== undefined) {
        formData.append(key, expenseClaimData[key]);
      }
    });
    
    const response = await api.patch(`/expenses/expense-claims/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel an expense claim
 * @param {number} id - Expense claim ID
 * @returns {Promise<Object>} - Cancelled expense claim
 */
export const cancelExpenseClaim = async (id) => {
  try {
    const response = await api.post(`/expenses/expense-claims/${id}/cancel/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve an expense claim
 * @param {number} id - Expense claim ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Approved expense claim
 */
export const approveExpenseClaim = async (id, comments = '') => {
  try {
    const response = await api.post(`/expenses/expense-claims/${id}/approve/`, {
      manager_comments: comments
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject an expense claim
 * @param {number} id - Expense claim ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Rejected expense claim
 */
export const rejectExpenseClaim = async (id, comments = '') => {
  try {
    const response = await api.post(`/expenses/expense-claims/${id}/reject/`, {
      manager_comments: comments
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Query an expense claim for more information
 * @param {number} id - Expense claim ID
 * @param {string} comments - Manager comments
 * @returns {Promise<Object>} - Queried expense claim
 */
export const queryExpenseClaim = async (id, comments = '') => {
  try {
    const response = await api.post(`/expenses/expense-claims/${id}/query/`, {
      manager_comments: comments
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
