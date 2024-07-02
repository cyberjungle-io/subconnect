import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mainRows: [{ id: Date.now(), columns: [] }],
  columnWidths: {},
  columnHeights: {},
  containerWidths: {},
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addColumn: (state, action) => {
      const { rowIndex, path } = action.payload;
      let current = state.mainRows[rowIndex].columns;
     
      for (let i = 0; i < path.length; i += 2) {
        const columnIndex = current.findIndex(col => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }
     
      const newColumnId = Date.now();
      current.push({ id: newColumnId, rows: [] });
      state.columnWidths[newColumnId] = 200;
      state.columnHeights[newColumnId] = 200;
    },
    addRow: (state, action) => {
      const { rowIndex, path } = action.payload;
      let current = state.mainRows[rowIndex].columns;
     
      for (let i = 0; i < path.length; i += 2) {
        const columnIndex = current.findIndex(col => col.id === path[i]);
        if (i === path.length - 1) {
          current[columnIndex].rows.push({ id: Date.now(), columns: [] });
        } else {
          current = current[columnIndex].rows[path[i + 1]].columns;
        }
      }
    },
    deleteColumn: (state, action) => {
      const { rowIndex, path } = action.payload;
      let current = state.mainRows[rowIndex].columns;
     
      for (let i = 0; i < path.length - 1; i += 2) {
        const columnIndex = current.findIndex(col => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }
     
      const columnIndex = current.findIndex(col => col.id === path[path.length - 1]);
      current.splice(columnIndex, 1);
    },
    deleteRow: (state, action) => {
      const { rowIndex, path } = action.payload;
      let current = state.mainRows[rowIndex].columns;
     
      for (let i = 0; i < path.length - 2; i += 2) {
        const columnIndex = current.findIndex(col => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }
     
      const columnIndex = current.findIndex(col => col.id === path[path.length - 2]);
      current[columnIndex].rows.splice(path[path.length - 1], 1);
    },
    updateColumnSize: (state, action) => {
      const { columnId, width, height } = action.payload;
      if (width !== undefined) state.columnWidths[columnId] = width;
      if (height !== undefined) state.columnHeights[columnId] = height;
    },
    updateContainerWidth: (state, action) => {
      const { containerId, width } = action.payload;
      state.containerWidths[containerId] = width;
    },
  },
});

export const {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  updateColumnSize,
  updateContainerWidth
} = editorSlice.actions;

export default editorSlice.reducer;

