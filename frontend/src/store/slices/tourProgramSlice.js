import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tourProgramService from '../../services/tourProgramService';

// Async thunks
export const fetchTourPrograms = createAsyncThunk(
  'tourProgram/fetchTourPrograms',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.getTourPrograms(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch tour programs' });
    }
  }
);

export const fetchTourProgramById = createAsyncThunk(
  'tourProgram/fetchTourProgramById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.getTourProgramById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch tour program' });
    }
  }
);

export const createTourProgram = createAsyncThunk(
  'tourProgram/createTourProgram',
  async (tourProgramData, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.createTourProgram(tourProgramData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create tour program' });
    }
  }
);

export const updateTourProgram = createAsyncThunk(
  'tourProgram/updateTourProgram',
  async ({ id, tourProgramData }, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.updateTourProgram(id, tourProgramData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update tour program' });
    }
  }
);

export const submitTourProgram = createAsyncThunk(
  'tourProgram/submitTourProgram',
  async (id, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.submitTourProgram(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to submit tour program' });
    }
  }
);

export const approveTourProgram = createAsyncThunk(
  'tourProgram/approveTourProgram',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.approveTourProgram(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to approve tour program' });
    }
  }
);

export const rejectTourProgram = createAsyncThunk(
  'tourProgram/rejectTourProgram',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await tourProgramService.rejectTourProgram(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to reject tour program' });
    }
  }
);

// Initial state
const initialState = {
  tourPrograms: [],
  currentTourProgram: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
  success: false,
};

// Slice
const tourProgramSlice = createSlice({
  name: 'tourProgram',
  initialState,
  reducers: {
    clearCurrentTourProgram: (state) => {
      state.currentTourProgram = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTourPrograms
      .addCase(fetchTourPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.tourPrograms = action.payload.results || [];
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchTourPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch tour programs' };
      })
      
      // fetchTourProgramById
      .addCase(fetchTourProgramById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourProgramById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTourProgram = action.payload;
      })
      .addCase(fetchTourProgramById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch tour program' };
      })
      
      // createTourProgram
      .addCase(createTourProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTourProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTourProgram = action.payload;
      })
      .addCase(createTourProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to create tour program' };
      })
      
      // updateTourProgram
      .addCase(updateTourProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTourProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTourProgram = action.payload;
        
        // Update the tour program in the list if it exists
        const index = state.tourPrograms.findIndex(tp => tp.id === action.payload.id);
        if (index !== -1) {
          state.tourPrograms[index] = action.payload;
        }
      })
      .addCase(updateTourProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to update tour program' };
      })
      
      // submitTourProgram
      .addCase(submitTourProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitTourProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTourProgram = action.payload;
        
        // Update the tour program in the list if it exists
        const index = state.tourPrograms.findIndex(tp => tp.id === action.payload.id);
        if (index !== -1) {
          state.tourPrograms[index] = action.payload;
        }
      })
      .addCase(submitTourProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to submit tour program' };
      })
      
      // approveTourProgram
      .addCase(approveTourProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(approveTourProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTourProgram = action.payload;
        
        // Update the tour program in the list if it exists
        const index = state.tourPrograms.findIndex(tp => tp.id === action.payload.id);
        if (index !== -1) {
          state.tourPrograms[index] = action.payload;
        }
      })
      .addCase(approveTourProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to approve tour program' };
      })
      
      // rejectTourProgram
      .addCase(rejectTourProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rejectTourProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTourProgram = action.payload;
        
        // Update the tour program in the list if it exists
        const index = state.tourPrograms.findIndex(tp => tp.id === action.payload.id);
        if (index !== -1) {
          state.tourPrograms[index] = action.payload;
        }
      })
      .addCase(rejectTourProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to reject tour program' };
      });
  },
});

// Export actions and reducer
export const { clearCurrentTourProgram, clearError, clearSuccess } = tourProgramSlice.actions;
export default tourProgramSlice.reducer;
