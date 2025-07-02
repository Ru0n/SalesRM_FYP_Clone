import api from './api';

/**
 * Get all doctor specialties
 * @returns {Promise<Array>} - List of doctor specialties
 */
export const getDoctorSpecialties = async () => {
  try {
    const response = await api.get('/masters/doctor-specialties/');
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all chemist categories
 * @returns {Promise<Array>} - List of chemist categories
 */
export const getChemistCategories = async () => {
  try {
    const response = await api.get('/masters/chemist-categories/');
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all doctors
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of doctors
 */
export const getDoctors = async (params = {}) => {
  try {
    const response = await api.get('/masters/doctors/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific doctor by ID
 * @param {number} id - Doctor ID
 * @returns {Promise<Object>} - Doctor details
 */
export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/masters/doctors/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new doctor
 * @param {Object} doctorData - Doctor data
 * @returns {Promise<Object>} - Created doctor
 */
export const createDoctor = async (doctorData) => {
  try {
    const response = await api.post('/masters/doctors/', doctorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a doctor
 * @param {number} id - Doctor ID
 * @param {Object} doctorData - Updated doctor data
 * @returns {Promise<Object>} - Updated doctor
 */
export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await api.patch(`/masters/doctors/${id}/`, doctorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a doctor
 * @param {number} id - Doctor ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/masters/doctors/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all chemists
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Paginated list of chemists
 */
export const getChemists = async (params = {}) => {
  try {
    const response = await api.get('/masters/chemists/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific chemist by ID
 * @param {number} id - Chemist ID
 * @returns {Promise<Object>} - Chemist details
 */
export const getChemistById = async (id) => {
  try {
    const response = await api.get(`/masters/chemists/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new chemist
 * @param {Object} chemistData - Chemist data
 * @returns {Promise<Object>} - Created chemist
 */
export const createChemist = async (chemistData) => {
  try {
    const response = await api.post('/masters/chemists/', chemistData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a chemist
 * @param {number} id - Chemist ID
 * @param {Object} chemistData - Updated chemist data
 * @returns {Promise<Object>} - Updated chemist
 */
export const updateChemist = async (id, chemistData) => {
  try {
    const response = await api.patch(`/masters/chemists/${id}/`, chemistData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a chemist
 * @param {number} id - Chemist ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteChemist = async (id) => {
  try {
    const response = await api.delete(`/masters/chemists/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
