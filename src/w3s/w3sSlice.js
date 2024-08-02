import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { w3sService } from './w3sService';

// Async Thunks
export const fetchProjects = createAsyncThunk(
  'w3s/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await w3sService.getProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'w3s/fetchProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await w3sService.getProject(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
    'w3s/createProject',
    async (projectData, { rejectWithValue }) => {
      try {
        console.log('createProject thunk called with:', projectData);
        const response = await w3sService.createProject(projectData);
        console.log('Project created successfully:', response);
        return response;
      } catch (error) {
        console.error('Error in createProject thunk:', error);
        return rejectWithValue(error.message || 'Failed to create project');
      }
    }
  );

export const updateProject = createAsyncThunk(
  'w3s/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await w3sService.updateProject(id, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update project');
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
      return rejectWithValue(error.response?.data || 'Failed to delete project');
    }
  }
);

// Slice
const w3sSlice = createSlice({
    name: 'w3s',
    initialState: {
      projects: {
        list: [],
        status: 'idle',
        error: null,
      },
      currentProject: {
        data: null,
        status: 'idle',
        error: null,
      },
    },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = {
        data: null,
        status: 'idle',
        error: null,
      };
    },
    // Add more synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(createProject.pending, (state) => {
        state.projects.status = 'loading';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.status = 'succeeded';
        state.projects.list.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.projects.status = 'failed';
        state.projects.error = action.payload;
      })

      // Fetch Single Project
      .addCase(fetchProject.pending, (state) => {
        state.currentProject.status = 'loading';
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.currentProject.status = 'succeeded';
        state.currentProject.data = action.payload;
        state.currentProject.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.currentProject.status = 'failed';
        state.currentProject.error = action.payload;
      })

      

      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.list.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects.list[index] = action.payload;
        }
        if (state.currentProject.data && state.currentProject.data.id === action.payload.id) {
          state.currentProject.data = action.payload;
        }
      })

      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects.list = state.projects.list.filter(project => project.id !== action.payload);
        if (state.currentProject.data && state.currentProject.data.id === action.payload) {
          state.currentProject.data = null;
        }
      });
  },
});

export const { clearCurrentProject } = w3sSlice.actions;

export default w3sSlice.reducer;