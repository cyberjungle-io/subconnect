// src/w3s/w3sSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { w3sService } from './w3sService';

export const fetchProjects = createAsyncThunk(
  'w3s/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await w3sService.getProjects();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProject = createAsyncThunk(
  'w3s/fetchProject',
  async (id, { rejectWithValue }) => {
    try {
      return await w3sService.getProject(id);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'w3s/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      return await w3sService.createProject(projectData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  'w3s/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      return await w3sService.updateProject(id, projectData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'w3s/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await w3sService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const w3sSlice = createSlice({
  name: 'w3s',
  initialState: {
    projects: {
      list: [],
      currentProject: null,
      status: 'idle',
      error: null,
    },
  },
  reducers: {
    // Any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.projects.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects.status = 'succeeded';
        state.projects.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.projects.status = 'failed';
        state.projects.error = action.payload;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.projects.currentProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.list.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.list.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects.list[index] = action.payload;
        }
        if (state.projects.currentProject && state.projects.currentProject._id === action.payload._id) {
          state.projects.currentProject = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects.list = state.projects.list.filter(project => project._id !== action.payload);
        if (state.projects.currentProject && state.projects.currentProject._id === action.payload) {
          state.projects.currentProject = null;
        }
      });
  },
});

export default w3sSlice.reducer;