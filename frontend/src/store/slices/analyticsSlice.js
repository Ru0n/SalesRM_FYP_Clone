import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

// Async thunks
export const fetchPerformanceReport = createAsyncThunk(
  'analytics/fetchPerformanceReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getPerformanceReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTopPerformers = createAsyncThunk(
  'analytics/fetchTopPerformers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTopPerformers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  performanceReport: {
    data: null,
    loading: false,
    error: null,
  },
  topPerformers: {
    data: [],
    loading: false,
    error: null,
  },
  filters: {
    start_date: null,
    end_date: null,
    user_id: null,
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        start_date: null,
        end_date: null,
        user_id: null,
      };
    },
    clearPerformanceReport: (state) => {
      state.performanceReport = {
        data: null,
        loading: false,
        error: null,
      };
    },
    clearTopPerformers: (state) => {
      state.topPerformers = {
        data: [],
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Performance Report
      .addCase(fetchPerformanceReport.pending, (state) => {
        state.performanceReport.loading = true;
        state.performanceReport.error = null;
      })
      .addCase(fetchPerformanceReport.fulfilled, (state, action) => {
        state.performanceReport.loading = false;
        state.performanceReport.data = action.payload;
        state.performanceReport.error = null;
      })
      .addCase(fetchPerformanceReport.rejected, (state, action) => {
        state.performanceReport.loading = false;
        state.performanceReport.error = action.payload;
      })
      // Top Performers
      .addCase(fetchTopPerformers.pending, (state) => {
        state.topPerformers.loading = true;
        state.topPerformers.error = null;
      })
      .addCase(fetchTopPerformers.fulfilled, (state, action) => {
        state.topPerformers.loading = false;
        state.topPerformers.data = action.payload;
        state.topPerformers.error = null;
      })
      .addCase(fetchTopPerformers.rejected, (state, action) => {
        state.topPerformers.loading = false;
        state.topPerformers.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearPerformanceReport, clearTopPerformers } = analyticsSlice.actions;

export default analyticsSlice.reducer;
