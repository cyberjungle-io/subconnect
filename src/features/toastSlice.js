import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  isVisible: false,
  type: 'success',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.isVisible = true;
      state.type = action.payload.type || 'success';
    },
    hideToast: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;