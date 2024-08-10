// src/features/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { w3sService } from '../w3s/w3sService';
import { fetchProjects, setCurrentProject } from '../w3s/w3sSlice'; // Add this import

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await w3sService.register(userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data || 'Failed to register');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await w3sService.login(credentials);
      // Fetch projects after successful login
      const projects = await w3sService.getProjects();
      dispatch(fetchProjects.fulfilled(projects));
      // Set the first project as the current project if available
      if (projects.length > 0) {
        dispatch(setCurrentProject(projects[0]));
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to login');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await w3sService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to logout');
    }
  }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
      currentUser: null,
      status: 'idle',
      error: null,
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.currentUser = action.payload;
          state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
          console.error('Registration failed:', action.payload);
        })
        .addCase(loginUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload;
            state.error = null;
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
          })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;