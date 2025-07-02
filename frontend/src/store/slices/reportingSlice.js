import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reportingService from '../../services/reportingService';

// Async thunks
export const fetchDCRSummaryReport = createAsyncThunk(
  'reporting/fetchDCRSummaryReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Process params to convert 'all' values to null
      const processedParams = Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = value === 'all' ? null : value;
        return acc;
      }, {});

      const data = await reportingService.getDCRSummaryReport(processedParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch DCR summary report' });
    }
  }
);

export const fetchExpenseSummaryReport = createAsyncThunk(
  'reporting/fetchExpenseSummaryReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Process params to convert 'all' values to null
      const processedParams = Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = value === 'all' ? null : value;
        return acc;
      }, {});

      const data = await reportingService.getExpenseSummaryReport(processedParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch expense summary report' });
    }
  }
);

export const fetchLeaveSummaryReport = createAsyncThunk(
  'reporting/fetchLeaveSummaryReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Process params to convert 'all' values to null
      const processedParams = Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = value === 'all' ? null : value;
        return acc;
      }, {});

      const data = await reportingService.getLeaveSummaryReport(processedParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch leave summary report' });
    }
  }
);

// Initial state
const initialState = {
  dcrSummary: {
    data: null,
    loading: false,
    error: null,
  },
  expenseSummary: {
    data: null,
    loading: false,
    error: null,
  },
  leaveSummary: {
    data: null,
    loading: false,
    error: null,
  },
  filters: {
    user_id: null,
    start_date: null,
    end_date: null,
    work_type: null,
    status: null,
    expense_type: null,
    leave_type: null,
  },
};

// Slice
const reportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    clearDCRSummaryError: (state) => {
      state.dcrSummary.error = null;
    },
    clearExpenseSummaryError: (state) => {
      state.expenseSummary.error = null;
    },
    clearLeaveSummaryError: (state) => {
      state.leaveSummary.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        user_id: null,
        start_date: null,
        end_date: null,
        work_type: null,
        status: null,
        expense_type: null,
        leave_type: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // DCR Summary Report
      .addCase(fetchDCRSummaryReport.pending, (state) => {
        state.dcrSummary.loading = true;
        state.dcrSummary.error = null;
      })
      .addCase(fetchDCRSummaryReport.fulfilled, (state, action) => {
        state.dcrSummary.loading = false;
        state.dcrSummary.data = action.payload;
      })
      .addCase(fetchDCRSummaryReport.rejected, (state, action) => {
        state.dcrSummary.loading = false;
        state.dcrSummary.error = action.payload;
      })

      // Expense Summary Report
      .addCase(fetchExpenseSummaryReport.pending, (state) => {
        state.expenseSummary.loading = true;
        state.expenseSummary.error = null;
      })
      .addCase(fetchExpenseSummaryReport.fulfilled, (state, action) => {
        state.expenseSummary.loading = false;
        state.expenseSummary.data = action.payload;
      })
      .addCase(fetchExpenseSummaryReport.rejected, (state, action) => {
        state.expenseSummary.loading = false;
        state.expenseSummary.error = action.payload;
      })

      // Leave Summary Report
      .addCase(fetchLeaveSummaryReport.pending, (state) => {
        state.leaveSummary.loading = true;
        state.leaveSummary.error = null;
      })
      .addCase(fetchLeaveSummaryReport.fulfilled, (state, action) => {
        state.leaveSummary.loading = false;
        state.leaveSummary.data = action.payload;
      })
      .addCase(fetchLeaveSummaryReport.rejected, (state, action) => {
        state.leaveSummary.loading = false;
        state.leaveSummary.error = action.payload;
      });
  },
});

export const {
  clearDCRSummaryError,
  clearExpenseSummaryError,
  clearLeaveSummaryError,
  setFilters,
  clearFilters,
} = reportingSlice.actions;

export default reportingSlice.reducer;
