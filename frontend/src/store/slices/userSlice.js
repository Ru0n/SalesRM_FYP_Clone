import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await userService.getUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch users' });
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await userService.getUserById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user' });
    }
  }
);

// Initial state
const initialState = {
  users: [],
  currentUser: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
