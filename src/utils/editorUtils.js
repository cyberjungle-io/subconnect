// Generate a unique ID for new elements
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get color based on nesting level
export const getColorForNestingLevel = (level) => {
  const colors = ["gray", "blue", "green", "red", "purple"];
  return colors[level % colors.length];
};

// Calculate the total width of all columns in a row
export const calculateTotalWidth = (columns, columnWidths) => {
  return columns.reduce(
    (total, column) => total + (columnWidths[column.id] || 0),
    0
  );
};

// Check if there's enough space to add a new column
export const canAddColumn = (
  containerWidth,
  columns,
  columnWidths,
  minColumnWidth = 200
) => {
  const totalWidth = calculateTotalWidth(columns, columnWidths);
  return containerWidth - totalWidth >= minColumnWidth;
};

// Deep clone an object (useful for nested state updates)
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Traverse nested structure to find a specific column
export const findColumn = (rows, path) => {
  let current = rows;
  for (let i = 0; i < path.length; i += 2) {
    const columnIndex = current.findIndex((col) => col.id === path[i]);
    if (i === path.length - 1) {
      return current[columnIndex];
    }
    current = current[columnIndex].rows[path[i + 1]].columns;
  }
  return null;
};

// Format bytes to a human-readable string
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
