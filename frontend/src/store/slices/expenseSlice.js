import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as expenseService from '../../services/expenseService';

// Async thunks
export const fetchExpenseTypes = createAsyncThunk(
  'expense/fetchExpenseTypes',
  async (_, { rejectWithValue }) => {
    try {
      const data = await expenseService.getExpenseTypes();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch expense types' });
    }
  }
);

export const fetchExpenseClaims = createAsyncThunk(
  'expense/fetchExpenseClaims',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await expenseService.getExpenseClaims(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch expense claims' });
    }
  }
);

export const fetchExpenseClaimById = createAsyncThunk(
  'expense/fetchExpenseClaimById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await expenseService.getExpenseClaimById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch expense claim' });
    }
  }
);

export const createExpenseClaim = createAsyncThunk(
  'expense/createExpenseClaim',
  async (expenseClaimData, { rejectWithValue }) => {
    try {
      const data = await expenseService.createExpenseClaim(expenseClaimData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create expense claim' });
    }
  }
);

export const updateExpenseClaim = createAsyncThunk(
  'expense/updateExpenseClaim',
  async ({ id, expenseClaimData }, { rejectWithValue }) => {
    try {
      const data = await expenseService.updateExpenseClaim(id, expenseClaimData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update expense claim' });
    }
  }
);

export const cancelExpenseClaim = createAsyncThunk(
  'expense/cancelExpenseClaim',
  async (id, { rejectWithValue }) => {
    try {
      const data = await expenseService.cancelExpenseClaim(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel expense claim' });
    }
  }
);

export const approveExpenseClaim = createAsyncThunk(
  'expense/approveExpenseClaim',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await expenseService.approveExpenseClaim(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to approve expense claim' });
    }
  }
);

export const rejectExpenseClaim = createAsyncThunk(
  'expense/rejectExpenseClaim',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await expenseService.rejectExpenseClaim(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to reject expense claim' });
    }
  }
);

export const queryExpenseClaim = createAsyncThunk(
  'expense/queryExpenseClaim',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await expenseService.queryExpenseClaim(id, comments);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to query expense claim' });
    }
  }
);

// Initial state
const initialState = {
  expenseTypes: [],
  expenseClaims: [],
  pagination: null,
  currentExpenseClaim: null,
  loading: false,
  error: null,
  success: false,
};

// Slice
const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentExpenseClaim: (state) => {
      state.currentExpenseClaim = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expense types
      .addCase(fetchExpenseTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseTypes = action.payload;
      })
      .addCase(fetchExpenseTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch expense claims
      .addCase(fetchExpenseClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchExpenseClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch expense claim by ID
      .addCase(fetchExpenseClaimById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseClaimById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExpenseClaim = action.payload;
      })
      .addCase(fetchExpenseClaimById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create expense claim
      .addCase(createExpenseClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createExpenseClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = [action.payload, ...state.expenseClaims];
        state.success = true;
      })
      .addCase(createExpenseClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update expense claim
      .addCase(updateExpenseClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateExpenseClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = state.expenseClaims.map(
          (claim) => claim.id === action.payload.id ? action.payload : claim
        );
        state.currentExpenseClaim = action.payload;
        state.success = true;
      })
      .addCase(updateExpenseClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Cancel expense claim
      .addCase(cancelExpenseClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelExpenseClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = state.expenseClaims.map(
          (claim) => claim.id === action.payload.id ? action.payload : claim
        );
        state.currentExpenseClaim = action.payload;
        state.success = true;
      })
      .addCase(cancelExpenseClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Approve expense claim
      .addCase(approveExpenseClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(approveExpenseClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = state.expenseClaims.map(
          (claim) => claim.id === action.payload.id ? action.payload : claim
        );
        state.currentExpenseClaim = action.payload;
        state.success = true;
      })
      .addCase(approveExpenseClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Reject expense claim
      .addCase(rejectExpenseClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rejectExpenseClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = state.expenseClaims.map(
          (claim) => claim.id === action.payload.id ? action.payload : claim
        );
        state.currentExpenseClaim = action.payload;
        state.success = true;
      })
      .addCase(rejectExpenseClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Query expense claim
      .addCase(queryExpenseClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(queryExpenseClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseClaims = state.expenseClaims.map(
          (claim) => claim.id === action.payload.id ? action.payload : claim
        );
        state.currentExpenseClaim = action.payload;
        state.success = true;
      })
      .addCase(queryExpenseClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentExpenseClaim } = expenseSlice.actions;

export default expenseSlice.reducer;
