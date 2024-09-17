import { createSlice } from '@reduxjs/toolkit';

const savedComponentsSlice = createSlice({
  name: 'savedComponents',
  initialState: [],
  reducers: {
    saveComponent: (state, action) => {
      state.push(action.payload);
    },
    // ... other reducers if needed
  },
});

export const { saveComponent } = savedComponentsSlice.actions;
export default savedComponentsSlice.reducer;