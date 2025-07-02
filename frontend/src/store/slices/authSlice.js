import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService, logout as logoutService, getCurrentUser } from '../../services/auth';

/**
 * Async thunk for user login
 * On success, it will store the user data returned from the API
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Authenticate and get tokens and user data
      const data = await loginService(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

/**
 * Async thunk to fetch the current user's data
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user data' });
    }
  }
);

/**
 * Async thunk for user logout
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    logoutService();
    return null;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // Store user data from the login response
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Only set isAuthenticated to false if we have no token
        // This prevents logout on network errors
        if (action.payload?.status === 401) {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;