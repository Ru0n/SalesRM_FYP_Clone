import api from './api';

const analyticsService = {
  // Get performance report with filters
  getPerformanceReport: async (params = {}) => {
    try {
      const response = await api.get('/analytics/performance-report/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get top performers for dashboard widget
  getTopPerformers: async (params = {}) => {
    try {
      const response = await api.get('/analytics/top-performers/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default analyticsService;
