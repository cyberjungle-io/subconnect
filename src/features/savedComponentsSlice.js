import { createSlice } from '@reduxjs/toolkit';

const savedComponentsSlice = createSlice({
  name: 'savedComponents',
  initialState: [],
  reducers: {
    saveComponent: (state, action) => {
      const existingIndex = state.findIndex(comp => comp.id === action.payload.id);
      if (existingIndex !== -1) {
        state[existingIndex] = action.payload;
      } else {
        state.push({
          ...action.payload,
          name: `Saved ${action.payload.type}`,
          props: { ...action.payload.props }, // Ensure props are included
        });
      }
    },
    renameSavedComponent: (state, action) => {
      const { id, newName } = action.payload;
      const component = state.find(comp => comp.id === id);
      if (component) {
        component.name = newName;
      }
    },
  },
});

export const { saveComponent, renameSavedComponent } = savedComponentsSlice.actions;
export default savedComponentsSlice.reducer;
