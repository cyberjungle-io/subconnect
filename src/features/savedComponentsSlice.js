import { createSlice } from '@reduxjs/toolkit';

const savedComponentsSlice = createSlice({
  name: 'savedComponents',
  initialState: [],
  reducers: {
    saveComponent: (state, action) => {
      state.push(action.payload);
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