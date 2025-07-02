import api from './api';

/**
 * Get all notifications for the current user
 * @param {Object} params - Query parameters (e.g., { unread: true })
 * @returns {Promise} - Promise with notifications data
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/notifications/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get the count of unread notifications
 * @returns {Promise} - Promise with unread count
 */
export const getUnreadCount = async () => {
  try {
    console.log('Calling API to get unread count');
    const response = await api.get('/notifications/unread_count/');
    console.log('API response for unread count:', response.data);
    return response.data.unread_count;
  } catch (error) {
    console.error('API error getting unread count:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} id - Notification ID
 * @returns {Promise} - Promise with response data
 */
export const markAsRead = async (id) => {
  try {
    const response = await api.post(`/notifications/${id}/mark_as_read/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Promise with response data
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.post('/notifications/mark_all_as_read/');
    return response.data;
  } catch (error) {
    throw error;
  }
};