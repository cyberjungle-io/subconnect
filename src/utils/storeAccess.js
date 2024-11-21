import { store } from '../store/store';

export const getStore = () => store;

export const getEditorState = () => {
  const state = store.getState();
  return state.editor;
};

export const getCurrentUser = () => {
  const state = store.getState();
  return state.user.currentUser;
};

export const getSelectedComponents = () => {
  const state = store.getState();
  return {
    selectedIds: state.editor.selectedIds,
    components: state.editor.components
  };
}; 