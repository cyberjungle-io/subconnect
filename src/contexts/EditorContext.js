import React from 'react';

// Define the shape of our context
const EditorContextShape = {
  // State
  columnWidths: {},
  columnHeights: {},
  containerWidths: {},
  containerRefs: { current: {} },

  // Functions
  addColumn: () => {},
  addRow: () => {},
  deleteColumn: () => {},
  deleteRow: () => {},
  handleResizeStart: () => {},
  expandColumn: () => {},
};

// Create the context with default values
const EditorContext = React.createContext(EditorContextShape);

export default EditorContext;

// Optional: Export a custom hook for using this context
export const useEditorContext = () => {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorContext.Provider');
  }
  return context;
};