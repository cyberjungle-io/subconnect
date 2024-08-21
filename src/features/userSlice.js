// src/features/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { w3sService } from '../w3s/w3sService';
import { fetchProjects, setCurrentProject } from '../w3s/w3sSlice'; // Add this import
import { setEditorMode } from './editorSlice'; // Added this import

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
      // Save token to local storage
      localStorage.setItem('w3s_token', response.token);
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
  async (_, { dispatch }) => {
    try {
      await w3sService.logout();
      dispatch(setEditorMode('view')); // Switch to view mode
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('w3s_token');
    if (token) {
      try {
        const userData = await w3sService.verifyToken(token);
        const projects = await w3sService.getProjects();
        dispatch(fetchProjects.fulfilled(projects));
        if (projects.length > 0) {
          dispatch(setCurrentProject(projects[0]));
        }
        return userData;
      } catch (error) {
        localStorage.removeItem('w3s_token');
        throw error;
      }
    }
    return null;
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