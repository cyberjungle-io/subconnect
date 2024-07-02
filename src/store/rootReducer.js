import { combineReducers } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
// Import your slices here

const rootReducer = combineReducers({
    editor: editorReducer,
});

export default rootReducer;
