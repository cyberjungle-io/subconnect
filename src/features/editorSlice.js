import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainRows: [{ id: Date.now(), columns: [] }],
  columnWidths: {},
  columnHeights: {},
  containerWidths: {},
  pageSettings: {
    backgroundColor: '#ffffff',
    scrollDirection: 'vertical',
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
      h1: { fontSize: '2.5rem', fontWeight: 'bold', color: '#000000' },
      h2: { fontSize: '2rem', fontWeight: 'bold', color: '#000000' },
      h3: { fontSize: '1.75rem', fontWeight: 'bold', color: '#000000' },
      h4: { fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' },
      h5: { fontSize: '1.25rem', fontWeight: 'bold', color: '#000000' },
      h6: { fontSize: '1rem', fontWeight: 'bold', color: '#000000' },
      p: { fontSize: '1rem', fontWeight: 'normal', color: '#000000' },
    },
    scrollbar: {
      width: '10px',
      trackColor: '#f1f1f1',
      thumbColor: '#888',
      thumbHoverColor: '#555',
      borderRadius: '0px',
      opacity: '1',
      useDefault: false,
    },
  },
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addColumn: (state, action) => {
      console.log("addColumn action payload:", action.payload);
      console.log("Current state:", JSON.parse(JSON.stringify(state)));

      const { rowIndex, path = [] } = action.payload;

      if (
        rowIndex === undefined ||
        rowIndex < 0 ||
        rowIndex >= state.mainRows.length
      ) {
        console.error("Invalid rowIndex in addColumn:", rowIndex);
        return;
      }

      let current = state.mainRows[rowIndex];
      console.log("Initial current:", current);

      for (let i = 0; i < path.length; i += 2) {
        if (!current || !current.columns) {
          console.error("Invalid path in addColumn at step", i);
          return;
        }
        const columnIndex = current.columns.findIndex(
          (col) => col.id === path[i]
        );
        if (columnIndex === -1) {
          console.error("Column not found in addColumn at step", i);
          return;
        }
        current = current.columns[columnIndex];
        if (i + 1 < path.length) {
          if (!current.rows || !current.rows[path[i + 1]]) {
            console.error("Invalid row in addColumn at step", i + 1);
            return;
          }
          current = current.rows[path[i + 1]];
        }
        console.log("Current after step", i, ":", current);
      }

      const newColumnId = Date.now();
      if (!current.columns) {
        console.log("Creating new columns array");
        current.columns = [];
      }
      current.columns.push({ id: newColumnId, rows: [] });
      state.columnWidths[newColumnId] = 200;
      state.columnHeights[newColumnId] = 200;

      console.log(
        "Final state after addColumn:",
        JSON.parse(JSON.stringify(state))
      );
    },
    addRow: (state, action) => {
      const { rowIndex, path } = action.payload;
      let current = state.mainRows[rowIndex].columns;

      for (let i = 0; i < path.length; i += 2) {
        const columnIndex = current.findIndex((col) => col.id === path[i]);
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
        const columnIndex = current.findIndex((col) => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }

      const columnIndex = current.findIndex(
        (col) => col.id === path[path.length - 1]
      );
      current.splice(columnIndex, 1);
    },
    deleteRow: (state, action) => {
      const { rowIndex, path } = action.payload;
      let current = state.mainRows[rowIndex].columns;

      for (let i = 0; i < path.length - 2; i += 2) {
        const columnIndex = current.findIndex((col) => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }

      const columnIndex = current.findIndex(
        (col) => col.id === path[path.length - 2]
      );
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
    updateColumnColor: (state, action) => {
      const { columnId, color } = action.payload;
      const column = findColumn(state.mainRows, columnId);
      if (column) {
        column.color = color;
      }
    },
    updatePageSettings: (state, action) => {
      state.pageSettings = { ...state.pageSettings, ...action.payload };
    },
    updateTypography: (state, action) => {
      state.pageSettings.typography = { ...state.pageSettings.typography, ...action.payload };
    },
    updateHeadingStyle: (state, action) => {
      const { headingType, style } = action.payload;
      state.pageSettings.typography[headingType] = { ...state.pageSettings.typography[headingType], ...style };
    },
    updateScrollbarSettings: (state, action) => {
      state.pageSettings.scrollbar = { ...state.pageSettings.scrollbar, ...action.payload };
    },
  },
});
const findColumn = (rows, columnId) => {
  for (const row of rows) {
    for (const column of row.columns) {
      if (column.id === columnId) return column;
      if (column.rows) {
        const foundInNested = findColumn(column.rows, columnId);
        if (foundInNested) return foundInNested;
      }
    }
  }
  return null;
};
export const {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  updateColumnSize,
  updateContainerWidth,
  addMainRow,
  updateColumnColor,
  updatePageSettings,
  updateTypography,
  updateHeadingStyle,
  updateScrollbarSettings,
} = editorSlice.actions;

export default editorSlice.reducer;
