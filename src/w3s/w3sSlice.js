import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { w3sService } from './w3sService';

// Async Thunks

export const fetchProjects = createAsyncThunk(
  'w3s/fetchProjects',
  async (_, { getState }) => {
    const state = getState();
    const isGuestMode = state.user.isGuestMode;
    
    try {
      const projects = await w3sService.getProjects();
      return projects;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchProject = createAsyncThunk(
  'w3s/fetchProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await w3sService.getProject(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'w3s/createProject',
  async (projectData, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.user.isGuestMode) {
      return rejectWithValue('Cannot create projects in guest mode');
    }
    
    try {
      const response = await w3sService.createProject(projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'w3s/updateProject',
  async (projectData, { rejectWithValue }) => {
    try {
      console.log("w3s slice Updating project:", projectData);
      const response = await w3sService.updateProject(projectData._id, projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'w3s/deleteProject',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await w3sService.deleteProject(id);
      // Fetch updated project list after successful deletion
      dispatch(fetchProjects());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete project');
    }
  }
);

// Add this new async thunk for savePage
export const savePage = createAsyncThunk(
  'w3s/savePage',
  async ({ projectId, pageId, pageData }, { getState, rejectWithValue }) => {
    try {
      const response = await w3sService.updatePage(projectId, pageId, pageData);
      
      // Update the currentProject in the state
      const state = getState();
      const currentProject = state.w3s.currentProject.data;
      if (currentProject) {
        const updatedPages = currentProject.pages.map(page => 
          page._id === pageId ? { ...page, ...response } : page
        );
        const updatedProject = { ...currentProject, pages: updatedPages };
        return { updatedProject, updatedPage: response };
      }
      
      return { updatedPage: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to save page');
    }
  }
);

// New async thunk for saving the entire project
export const saveProject = createAsyncThunk(
  'w3s/saveProject',
  async (projectData, { rejectWithValue }) => {
    try {
      console.log("w3s Saving project:", projectData);
      const response = await w3sService.updateProject(projectData._id, projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to save project');
    }
  }
);

// New async thunks for GraphQL queries
export const fetchQueries = createAsyncThunk(
  'w3s/fetchQueries',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching queries...'); // Log 1
      const response = await w3sService.getQueries();
      console.log('Queries fetched successfully:', response); // Log 2
      return response;
    } catch (error) {
      console.error('Error fetching queries:', error); // Log 3
      return rejectWithValue(error.response?.data || 'Failed to fetch queries');
    }
  }
);

export const fetchQuery = createAsyncThunk(
  'w3s/fetchQuery',
  async (id, { rejectWithValue }) => {
    try {
      const response = await w3sService.getQuery(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch query');
    }
  }
);

export const createQuery = createAsyncThunk(
  'w3s/createQuery',
  async (queryData, { rejectWithValue }) => {
    try {
      console.log('Creating query with data:', queryData); // Add this log
      const response = await w3sService.createQuery(queryData);
      console.log('Create query response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error creating query:', error); // Debug log
      return rejectWithValue(error.response?.data || 'Failed to create query');
    }
  }
);

export const updateQuery = createAsyncThunk(
  'w3s/updateQuery',
  async (queryData, { rejectWithValue }) => {
    try {
      console.log('Updating query with data:', queryData); // Add this log
      const response = await w3sService.updateQuery(queryData._id, queryData);
      console.log('Update query response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error updating query:', error); // Debug log
      return rejectWithValue(error.response?.data || 'Failed to update query');
    }
  }
);

export const deleteQuery = createAsyncThunk(
  'w3s/deleteQuery',
  async (id, { rejectWithValue }) => {
    try {
      await w3sService.deleteQuery(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete query');
    }
  }
);

// New async thunks for component data
export const fetchComponentData = createAsyncThunk(
  'w3s/fetchComponentData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await w3sService.getComponentData();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch component data');
    }
  }
);

export const createComponentData = createAsyncThunk(
  'w3s/createComponentData',
  async (componentData, { rejectWithValue }) => {
    try {
      const response = await w3sService.createComponentData(componentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create component data');
    }
  }
);

export const updateComponentData = createAsyncThunk(
  'w3s/updateComponentData',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await w3sService.updateComponentData(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update component data');
    }
  }
);

export const deleteComponentData = createAsyncThunk(
  'w3s/deleteComponentData',
  async (id, { rejectWithValue }) => {
    try {
      await w3sService.deleteComponentData(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete component data');
    }
  }
);

// Add this new async thunk
export const fetchComponentDataById = createAsyncThunk(
  'w3s/fetchComponentDataById',
  async (componentId, { rejectWithValue }) => {
    try {
      const response = await w3sService.getComponentDataById(componentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch component data');
    }
  }
);

// Create the setCurrentProject action
export const setCurrentProject = createAction('w3s/setCurrentProject');

// Add new async thunk for checking access
export const checkAccess = createAsyncThunk(
  'w3s/checkAccess',
  async ({ linkId, userId }, { rejectWithValue }) => {
    try {
      const response = await w3sService.checkAccess(linkId, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check access');
    }
  }
);

// Add this new async thunk
export const fetchSharedProjects = createAsyncThunk(
  'w3s/fetchSharedProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await w3sService.getSharedProjects();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch shared projects');
    }
  }
);

// Add a selector to check if editing is allowed
export const selectCanEdit = state => !state.user.isGuestMode && state.user.currentUser;

// Slice
const initialState = {
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
  queries: {
    list: [],
    status: 'idle',
    error: null,
  },
  currentQuery: {
    data: null,
    status: 'idle',
    error: null,
  },
  componentData: {
    list: [],
    status: 'idle',
    error: null,
  },
  sharedProjects: {
    list: [],
    status: 'idle',
    error: null,
  },
};

const w3sSlice = createSlice({
    name: 'w3s',
    initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = {
        data: null,
        status: 'idle',
        error: null,
      };
    },
    updateCurrentProject: (state, action) => {
      console.log("updateCurrentProject:", action.payload);
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          data: action.payload
        }
      };
    },
    clearCurrentQuery: (state) => {
      state.currentQuery = {
        data: null,
        status: 'idle',
        error: null,
      };
    },
    clearW3sState: (state) => {
      // Reset the entire state to its initial values
      Object.assign(state, w3sSlice.getInitialState());
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects.status = 'succeeded';
        state.projects.list = action.payload;
      })

      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.status = 'succeeded';
        const newProject = { ...action.payload, pages: action.payload.pages || [] };
        state.projects.list.push(newProject);
        state.currentProject.data = newProject;
        state.currentProject.status = 'succeeded';
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
        const updatedProject = action.payload;
        state.currentProject.data = updatedProject;
        const index = state.projects.list.findIndex(project => project._id === updatedProject._id);
        if (index !== -1) {
          state.projects.list[index] = updatedProject;
        }
      })

      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects.list = state.projects.list.filter(project => project.id !== action.payload);
        if (state.currentProject.data && state.currentProject.data.id === action.payload) {
          state.currentProject.data = null;
        }
      })

      // Add a case for setCurrentProject
      .addCase(setCurrentProject, (state, action) => {
        state.currentProject.data = action.payload;
        state.currentProject.status = 'succeeded';
        state.currentProject.error = null;
      })

      // Add a case for savePage
      .addCase(savePage.fulfilled, (state, action) => {
        if (action.payload.updatedProject) {
          state.currentProject.data = action.payload.updatedProject;
        }
        if (state.currentProject.data) {
          const pageIndex = state.currentProject.data.pages.findIndex(page => page._id === action.payload.updatedPage._id);
          if (pageIndex !== -1) {
            state.currentProject.data.pages[pageIndex] = action.payload.updatedPage;
          }
        }
      })

      // Fetch Queries
      .addCase(fetchQueries.pending, (state) => {
        console.log('fetchQueries: pending'); // Log 4
        state.queries.status = 'loading';
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        console.log('fetchQueries: fulfilled', action.payload); // Log 5
        state.queries.status = 'succeeded';
        state.queries.list = action.payload;
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        console.log('fetchQueries: rejected', action.payload); // Log 6
        state.queries.status = 'failed';
        state.queries.error = action.payload;
      })

      // Fetch Single Query
      .addCase(fetchQuery.pending, (state) => {
        state.currentQuery.status = 'loading';
      })
      .addCase(fetchQuery.fulfilled, (state, action) => {
        state.currentQuery.status = 'succeeded';
        state.currentQuery.data = action.payload;
      })
      .addCase(fetchQuery.rejected, (state, action) => {
        state.currentQuery.status = 'failed';
        state.currentQuery.error = action.payload;
      })

      // Create Query
      .addCase(createQuery.fulfilled, (state, action) => {
        state.queries.list.push(action.payload);
      })

      // Update Query
      .addCase(updateQuery.fulfilled, (state, action) => {
        const index = state.queries.list.findIndex(query => query._id === action.payload._id);
        if (index !== -1) {
          state.queries.list[index] = action.payload;
        }
        if (state.currentQuery.data && state.currentQuery.data._id === action.payload._id) {
          state.currentQuery.data = action.payload;
        }
      })

      // Delete Query
      .addCase(deleteQuery.fulfilled, (state, action) => {
        state.queries.list = state.queries.list.filter(query => query._id !== action.payload);
        if (state.currentQuery.data && state.currentQuery.data._id === action.payload) {
          state.currentQuery.data = null;
        }
      })

      // Fetch Component Data
      .addCase(fetchComponentData.pending, (state) => {
        state.componentData.status = 'loading';
      })
      .addCase(fetchComponentData.fulfilled, (state, action) => {
        state.componentData.status = 'succeeded';
        state.componentData.list = action.payload;
      })
      .addCase(fetchComponentData.rejected, (state, action) => {
        state.componentData.status = 'failed';
        state.componentData.error = action.payload;
      })

      // Create Component Data
      .addCase(createComponentData.fulfilled, (state, action) => {
        //state.componentData.list.push(action.payload);
      })

      // Update Component Data
      .addCase(updateComponentData.fulfilled, (state, action) => {
        const index = state.componentData.list.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.componentData.list[index] = action.payload;
        }
      })

      // Delete Component Data
      .addCase(deleteComponentData.fulfilled, (state, action) => {
        state.componentData.list = state.componentData.list.filter(item => item._id !== action.payload);
      })

      // Add these new cases for fetchComponentDataById
      .addCase(fetchComponentDataById.pending, (state) => {
        state.componentData.status = 'loading';
      })
      .addCase(fetchComponentDataById.fulfilled, (state, action) => {
        state.componentData.status = 'succeeded';
        // Update the list if the component data doesn't exist, or replace it if it does
        const index = state.componentData.list.findIndex(item => item.componentId === action.payload.componentId);
        if (index !== -1) {
          state.componentData.list[index] = action.payload;
        } else {
          state.componentData.list.push(action.payload);
        }
      })
      .addCase(fetchComponentDataById.rejected, (state, action) => {
        state.componentData.status = 'failed';
        state.componentData.error = action.payload;
      })

      // Add these new cases for fetchSharedProjects
      .addCase(fetchSharedProjects.pending, (state) => {
        state.sharedProjects = {
          ...state.sharedProjects,
          status: 'loading',
          error: null
        };
      })
      .addCase(fetchSharedProjects.fulfilled, (state, action) => {
        state.sharedProjects = {
          list: action.payload,
          status: 'succeeded',
          error: null
        };
      })
      .addCase(fetchSharedProjects.rejected, (state, action) => {
        state.sharedProjects = {
          ...state.sharedProjects,
          status: 'failed',
          error: action.payload
        };
      });
  },
});

export const { clearCurrentProject, updateCurrentProject, clearCurrentQuery, clearW3sState } = w3sSlice.actions;
export default w3sSlice.reducer;
