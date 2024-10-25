import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { w3sService } from '../w3s/w3sService';

// Async thunks
export const fetchSavedComponents = createAsyncThunk(
  'savedComponents/fetchAll',
  async () => {
    console.log('fetchSavedComponents: Fetching saved components');
    const response = await w3sService.getSavedComponents();
    return response;
  }
);

export const saveSingleComponent = createAsyncThunk(
  'savedComponents/save',
  async (component) => {
    const response = await w3sService.createOrUpdateSavedComponent({
      id: component.id,
      createdBy: component.createdBy,
      ...component
    });
    return response;
  }
);

export const deleteSavedComponent = createAsyncThunk(
  'savedComponents/delete',
  async (id) => {
    console.log('deleteSavedComponent: Deleting saved component', id);
    await w3sService.deleteSavedComponent(id);
    return id;
  }
);

const savedComponentsSlice = createSlice({
  name: 'savedComponents',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    renameSavedComponent: (state, action) => {
      const { id, newName } = action.payload;
      const component = state.items.find(comp => comp.id === id);
      if (component) {
        component.name = newName;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedComponents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSavedComponents.fulfilled, (state, action) => {
        console.log('fetchSavedComponents: Successfully fetched saved components', action.payload);
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSavedComponents.rejected, (state, action) => {
        console.error('fetchSavedComponents: Error fetching saved components:', action.error);
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveSingleComponent.fulfilled, (state, action) => {
        const existingIndex = state.items.findIndex(comp => comp.id === action.payload.id);
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(deleteSavedComponent.fulfilled, (state, action) => {
        state.items = state.items.filter(comp => comp.id !== action.payload);
      });
  },
});

export const { saveComponent, renameSavedComponent } = savedComponentsSlice.actions;
export default savedComponentsSlice.reducer;
