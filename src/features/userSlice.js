// src/features/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { w3sService } from '../w3s/w3sService';
import { fetchProjects, setCurrentProject, clearW3sState, fetchSharedProjects } from '../w3s/w3sSlice';
import { setEditorMode, resetEditorState } from './editorSlice';
import { showToast } from './toastSlice'; // Import the showToast action

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
      // Wait for a short time to ensure the token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      // Return user data with token
      return { ...response.user, token: response.token };
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
      dispatch(clearW3sState()); // Clear w3s state
      dispatch(resetEditorState()); // Reset editor state
      localStorage.removeItem('w3s_token'); // Remove token from local storage
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('w3s_token');
    if (token) {
      try {
        const userData = await w3sService.verifyToken(token);
        await dispatch(fetchProjects());
        return userData;
      } catch (error) {
        localStorage.removeItem('w3s_token');
        return rejectWithValue(error.message);
      }
    }
    return rejectWithValue('No token found');
  }
);

export const addUserAccess = createAsyncThunk(
  'user/addAccess',
  async (accessData, { rejectWithValue }) => {
    try {
      const response = await w3sService.addUserAccess(accessData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserAccesses = createAsyncThunk(
  'user/getAccesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await w3sService.getUserAccesses();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAccessesByLinkId = createAsyncThunk(
  'user/getAccessesByLinkId',
  async (linkId, { rejectWithValue }) => {
    try {
      const response = await w3sService.getAccessesByLinkId(linkId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUserAccessByEmail = createAsyncThunk(
  'user/addAccessByEmail',
  async (accessData, { rejectWithValue, dispatch }) => {
    try {
      const response = await w3sService.addUserAccessByEmail(accessData);
      dispatch(showToast({ message: 'User access added successfully', type: 'success' }));
      dispatch(fetchProjects());
      dispatch(fetchSharedProjects());
      return response.data;
    } catch (error) {
      console.error('Error adding user access by email:', error);
      dispatch(showToast({ message: 'Failed to add user access', type: 'error' }));
      return rejectWithValue(error.response?.data || error.message || 'An error occurred while adding user access');
    }
  }
);

export const setGuestMode = createAsyncThunk(
  'user/setGuestMode',
  async (isGuest, { dispatch }) => {
    if (isGuest) {
      localStorage.removeItem('w3s_token');
      dispatch(setEditorMode('view'));
      await dispatch(fetchProjects());
      return true;
    } else {
      dispatch(clearW3sState());
      dispatch(resetEditorState());
      return false;
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'user/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      await w3sService.requestPasswordReset(email);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to request password reset');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      await w3sService.resetPassword(token, password);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to reset password');
    }
  }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
      currentUser: null,
      status: 'idle',
      error: null,
      userAccesses: [], // Initialize this as an empty array
      linkAccesses: [],
      isGuestMode: false,
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
      }
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
            state.isGuestMode = false;
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
      })
      .addCase(addUserAccess.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUserAccess.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userAccesses.push(action.payload);
      })
      .addCase(addUserAccess.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getUserAccesses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserAccesses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userAccesses = action.payload;
      })
      .addCase(getUserAccesses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getAccessesByLinkId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAccessesByLinkId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.linkAccesses = action.payload;
      })
      .addCase(getAccessesByLinkId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addUserAccessByEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUserAccessByEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (!state.userAccesses) {
          state.userAccesses = [];
        }
        if (Array.isArray(action.payload)) {
          state.userAccesses = [...state.userAccesses, ...action.payload];
        } else if (action.payload) {
          state.userAccesses = [...state.userAccesses, action.payload];
        }
      })
      .addCase(addUserAccessByEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(setGuestMode.fulfilled, (state, action) => {
        state.isGuestMode = action.payload;
        state.currentUser = null;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
