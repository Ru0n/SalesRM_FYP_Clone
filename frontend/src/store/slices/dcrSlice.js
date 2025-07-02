import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dcrService from '../../services/dcrService';

// Async thunks
export const fetchDailyCallReports = createAsyncThunk(
  'dcr/fetchDailyCallReports',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await dcrService.getDailyCallReports(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch daily call reports' });
    }
  }
);

export const fetchDailyCallReportById = createAsyncThunk(
  'dcr/fetchDailyCallReportById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await dcrService.getDailyCallReportById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch daily call report' });
    }
  }
);

export const createDailyCallReport = createAsyncThunk(
  'dcr/createDailyCallReport',
  async (dcrData, { rejectWithValue }) => {
    try {
      const data = await dcrService.createDailyCallReport(dcrData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create daily call report' });
    }
  }
);

export const updateDailyCallReport = createAsyncThunk(
  'dcr/updateDailyCallReport',
  async ({ id, dcrData }, { rejectWithValue }) => {
    try {
      const data = await dcrService.updateDailyCallReport(id, dcrData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update daily call report' });
    }
  }
);

export const deleteDailyCallReport = createAsyncThunk(
  'dcr/deleteDailyCallReport',
  async (id, { rejectWithValue }) => {
    try {
      await dcrService.deleteDailyCallReport(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete daily call report' });
    }
  }
);

const initialState = {
  dailyCallReports: [],
  currentDailyCallReport: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
  success: false,
};

const dcrSlice = createSlice({
  name: 'dcr',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentDailyCallReport: (state) => {
      state.currentDailyCallReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch daily call reports
      .addCase(fetchDailyCallReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyCallReports.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCallReports = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchDailyCallReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch daily call report by ID
      .addCase(fetchDailyCallReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyCallReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDailyCallReport = action.payload;
      })
      .addCase(fetchDailyCallReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create daily call report
      .addCase(createDailyCallReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDailyCallReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCallReports = [action.payload, ...state.dailyCallReports];
        state.success = true;
      })
      .addCase(createDailyCallReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update daily call report
      .addCase(updateDailyCallReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDailyCallReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCallReports = state.dailyCallReports.map(
          (report) => report.id === action.payload.id ? action.payload : report
        );
        state.currentDailyCallReport = action.payload;
        state.success = true;
      })
      .addCase(updateDailyCallReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete daily call report
      .addCase(deleteDailyCallReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteDailyCallReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCallReports = state.dailyCallReports.filter(report => report.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteDailyCallReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentDailyCallReport } = dcrSlice.actions;

export default dcrSlice.reducer;
