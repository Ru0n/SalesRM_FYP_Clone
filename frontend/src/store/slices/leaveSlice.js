import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as leaveService from '../../services/leaveService';

// Async thunks
export const fetchLeaveTypes = createAsyncThunk(
  'leave/fetchLeaveTypes',
  async (_, { rejectWithValue }) => {
    try {
      const data = await leaveService.getLeaveTypes();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch leave types' });
    }
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchLeaveRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await leaveService.getLeaveRequests(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch leave requests' });
    }
  }
);

export const fetchLeaveRequestById = createAsyncThunk(
  'leave/fetchLeaveRequestById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await leaveService.getLeaveRequestById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch leave request' });
    }
  }
);

export const createLeaveRequest = createAsyncThunk(
  'leave/createLeaveRequest',
  async (leaveRequestData, { rejectWithValue }) => {
    try {
      const data = await leaveService.createLeaveRequest(leaveRequestData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create leave request' });
    }
  }
);

export const updateLeaveRequest = createAsyncThunk(
  'leave/updateLeaveRequest',
  async ({ id, leaveRequestData }, { rejectWithValue }) => {
    try {
      const data = await leaveService.updateLeaveRequest(id, leaveRequestData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update leave request' });
    }
  }
);

export const cancelLeaveRequest = createAsyncThunk(
  'leave/cancelLeaveRequest',
  async (id, { rejectWithValue }) => {
    try {
      const data = await leaveService.cancelLeaveRequest(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel leave request' });
    }
  }
);

export const approveLeaveRequest = createAsyncThunk(
  'leave/approveLeaveRequest',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await leaveService.approveLeaveRequest(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to approve leave request' });
    }
  }
);

export const rejectLeaveRequest = createAsyncThunk(
  'leave/rejectLeaveRequest',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await leaveService.rejectLeaveRequest(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to reject leave request' });
    }
  }
);

const initialState = {
  leaveTypes: [],
  leaveRequests: [],
  currentLeaveRequest: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
  success: false,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentLeaveRequest: (state) => {
      state.currentLeaveRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leave types
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = action.payload;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch leave requests
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch leave request by ID
      .addCase(fetchLeaveRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLeaveRequest = action.payload;
      })
      .addCase(fetchLeaveRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create leave request
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = [action.payload, ...state.leaveRequests];
        state.success = true;
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update leave request
      .addCase(updateLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.map(
          (request) => request.id === action.payload.id ? action.payload : request
        );
        state.currentLeaveRequest = action.payload;
        state.success = true;
      })
      .addCase(updateLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Cancel leave request
      .addCase(cancelLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.map(
          (request) => request.id === action.payload.id ? action.payload : request
        );
        state.currentLeaveRequest = action.payload;
        state.success = true;
      })
      .addCase(cancelLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Approve leave request
      .addCase(approveLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(approveLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.map(
          (request) => request.id === action.payload.id ? action.payload : request
        );
        state.currentLeaveRequest = action.payload;
        state.success = true;
      })
      .addCase(approveLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Reject leave request
      .addCase(rejectLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rejectLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.map(
          (request) => request.id === action.payload.id ? action.payload : request
        );
        state.currentLeaveRequest = action.payload;
        state.success = true;
      })
      .addCase(rejectLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentLeaveRequest } = leaveSlice.actions;

export default leaveSlice.reducer;