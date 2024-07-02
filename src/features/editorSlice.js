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
      console.log('addColumn action payload:', action.payload);
      console.log('Current state:', JSON.parse(JSON.stringify(state)));

      const { rowIndex, path = [] } = action.payload;
      
      if (rowIndex === undefined || rowIndex < 0 || rowIndex >= state.mainRows.length) {
        console.error('Invalid rowIndex in addColumn:', rowIndex);
        return;
      }

      let current = state.mainRows[rowIndex];
      console.log('Initial current:', current);
     
      for (let i = 0; i < path.length; i += 2) {
        if (!current || !current.columns) {
          console.error('Invalid path in addColumn at step', i);
          return;
        }
        const columnIndex = current.columns.findIndex(col => col.id === path[i]);
        if (columnIndex === -1) {
          console.error('Column not found in addColumn at step', i);
          return;
        }
        current = current.columns[columnIndex];
        if (i + 1 < path.length) {
          if (!current.rows || !current.rows[path[i + 1]]) {
            console.error('Invalid row in addColumn at step', i + 1);
            return;
          }
          current = current.rows[path[i + 1]];
        }
        console.log('Current after step', i, ':', current);
      }
     
      const newColumnId = Date.now();
      if (!current.columns) {
        console.log('Creating new columns array');
        current.columns = [];
      }
      current.columns.push({ id: newColumnId, rows: [] });
      state.columnWidths[newColumnId] = 200;
      state.columnHeights[newColumnId] = 200;

      console.log('Final state after addColumn:', JSON.parse(JSON.stringify(state)));
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
    addMainRow: (state) => {
      state.mainRows.push({ id: Date.now(), columns: [] });
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
  updateContainerWidth,
  addMainRow
} = editorSlice.actions;

export default editorSlice.reducer;

