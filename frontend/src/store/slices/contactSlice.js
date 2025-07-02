import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as contactService from '../../services/contactService';

// Async thunks for Doctor Specialties
export const fetchDoctorSpecialties = createAsyncThunk(
  'contact/fetchDoctorSpecialties',
  async (_, { rejectWithValue }) => {
    try {
      const data = await contactService.getDoctorSpecialties();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch doctor specialties' });
    }
  }
);

// Async thunks for Chemist Categories
export const fetchChemistCategories = createAsyncThunk(
  'contact/fetchChemistCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await contactService.getChemistCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch chemist categories' });
    }
  }
);

// Async thunks for Doctors
export const fetchDoctors = createAsyncThunk(
  'contact/fetchDoctors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await contactService.getDoctors(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch doctors' });
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'contact/fetchDoctorById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await contactService.getDoctorById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch doctor' });
    }
  }
);

export const createDoctor = createAsyncThunk(
  'contact/createDoctor',
  async (doctorData, { rejectWithValue }) => {
    try {
      const data = await contactService.createDoctor(doctorData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create doctor' });
    }
  }
);

export const updateDoctor = createAsyncThunk(
  'contact/updateDoctor',
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const data = await contactService.updateDoctor(id, doctorData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update doctor' });
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  'contact/deleteDoctor',
  async (id, { rejectWithValue }) => {
    try {
      await contactService.deleteDoctor(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete doctor' });
    }
  }
);

// Async thunks for Chemists
export const fetchChemists = createAsyncThunk(
  'contact/fetchChemists',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await contactService.getChemists(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch chemists' });
    }
  }
);

export const fetchChemistById = createAsyncThunk(
  'contact/fetchChemistById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await contactService.getChemistById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch chemist' });
    }
  }
);

export const createChemist = createAsyncThunk(
  'contact/createChemist',
  async (chemistData, { rejectWithValue }) => {
    try {
      const data = await contactService.createChemist(chemistData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create chemist' });
    }
  }
);

export const updateChemist = createAsyncThunk(
  'contact/updateChemist',
  async ({ id, chemistData }, { rejectWithValue }) => {
    try {
      const data = await contactService.updateChemist(id, chemistData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update chemist' });
    }
  }
);

export const deleteChemist = createAsyncThunk(
  'contact/deleteChemist',
  async (id, { rejectWithValue }) => {
    try {
      await contactService.deleteChemist(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete chemist' });
    }
  }
);

const initialState = {
  doctorSpecialties: [],
  chemistCategories: [],
  doctors: [],
  chemists: [],
  currentDoctor: null,
  currentChemist: null,
  doctorPagination: {
    count: 0,
    next: null,
    previous: null,
  },
  chemistPagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
  success: false,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
    clearCurrentChemist: (state) => {
      state.currentChemist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Doctor Specialties
      .addCase(fetchDoctorSpecialties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorSpecialties.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorSpecialties = action.payload;
      })
      .addCase(fetchDoctorSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Chemist Categories
      .addCase(fetchChemistCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChemistCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.chemistCategories = action.payload;
      })
      .addCase(fetchChemistCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.results;
        state.doctorPagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = [action.payload, ...state.doctors];
        state.success = true;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.map(
          (doctor) => doctor.id === action.payload.id ? action.payload : doctor
        );
        state.currentDoctor = action.payload;
        state.success = true;
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter(doctor => doctor.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Chemists
      .addCase(fetchChemists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChemists.fulfilled, (state, action) => {
        state.loading = false;
        state.chemists = action.payload.results;
        state.chemistPagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchChemists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchChemistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChemistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChemist = action.payload;
      })
      .addCase(fetchChemistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createChemist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createChemist.fulfilled, (state, action) => {
        state.loading = false;
        state.chemists = [action.payload, ...state.chemists];
        state.success = true;
      })
      .addCase(createChemist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(updateChemist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateChemist.fulfilled, (state, action) => {
        state.loading = false;
        state.chemists = state.chemists.map(
          (chemist) => chemist.id === action.payload.id ? action.payload : chemist
        );
        state.currentChemist = action.payload;
        state.success = true;
      })
      .addCase(updateChemist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(deleteChemist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteChemist.fulfilled, (state, action) => {
        state.loading = false;
        state.chemists = state.chemists.filter(chemist => chemist.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteChemist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentDoctor, clearCurrentChemist } = contactSlice.actions;

export default contactSlice.reducer;
