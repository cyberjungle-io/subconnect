import { useState, useCallback, useRef, useEffect } from "react";

const useEditor = (initialMainRows) => {
  const [mainRows, setMainRows] = useState(initialMainRows);
  const [columnWidths, setColumnWidths] = useState({});
  const [columnHeights, setColumnHeights] = useState({});
  const [containerWidths, setContainerWidths] = useState({});
  const containerRefs = useRef({});

  useEffect(() => {
    const updateContainerWidths = () => {
      const newContainerWidths = {};
      Object.keys(containerRefs.current).forEach((key) => {
        if (containerRefs.current[key]) {
          newContainerWidths[key] = containerRefs.current[key].offsetWidth;
        }
      });
      setContainerWidths(newContainerWidths);
    };

    updateContainerWidths();
    window.addEventListener("resize", updateContainerWidths);

    return () => window.removeEventListener("resize", updateContainerWidths);
  }, []);

  const addColumn = useCallback((rowIndex, path = []) => {
    setMainRows((prevRows) => {
      const newRows = [...prevRows];
      let current = newRows[rowIndex].columns;

      for (let i = 0; i < path.length; i += 2) {
        const columnIndex = current.findIndex((col) => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }

      const newColumnId = Date.now();
      current.push({ id: newColumnId, rows: [] });

      setColumnWidths((prev) => ({ ...prev, [newColumnId]: 200 }));
      setColumnHeights((prev) => ({ ...prev, [newColumnId]: 200 }));

      return newRows;
    });
  }, []);

  const addRow = useCallback((rowIndex, path = []) => {
    setMainRows((prevRows) => {
      const newRows = [...prevRows];
      let current = newRows[rowIndex].columns;

      for (let i = 0; i < path.length; i += 2) {
        const columnIndex = current.findIndex((col) => col.id === path[i]);
        if (i === path.length - 1) {
          current[columnIndex].rows.push({ id: Date.now(), columns: [] });
        } else {
          current = current[columnIndex].rows[path[i + 1]].columns;
        }
      }

      return newRows;
    });
  }, []);

  const deleteColumn = useCallback((rowIndex, path = []) => {
    setMainRows((prevRows) => {
      const newRows = [...prevRows];
      let current = newRows[rowIndex].columns;

      for (let i = 0; i < path.length - 1; i += 2) {
        const columnIndex = current.findIndex((col) => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }

      const columnIndex = current.findIndex(
        (col) => col.id === path[path.length - 1]
      );
      current.splice(columnIndex, 1);

      return newRows;
    });
  }, []);

  const deleteRow = useCallback((rowIndex, path = []) => {
    setMainRows((prevRows) => {
      const newRows = [...prevRows];
      let current = newRows[rowIndex].columns;

      for (let i = 0; i < path.length - 2; i += 2) {
        const columnIndex = current.findIndex((col) => col.id === path[i]);
        current = current[columnIndex].rows[path[i + 1]].columns;
      }

      const columnIndex = current.findIndex(
        (col) => col.id === path[path.length - 2]
      );
      current[columnIndex].rows.splice(path[path.length - 1], 1);

      return newRows;
    });
  }, []);

  const handleResizeStart = useCallback(
    (e, columnId, isVertical = false) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = columnWidths[columnId];
      const startHeight = columnHeights[columnId];
      const containerWidth =
        containerRefs.current[columnId]?.parentElement?.offsetWidth || 0;

      const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        if (isVertical) {
          const deltaY = moveEvent.clientY - startY;
          setColumnHeights((prev) => ({
            ...prev,
            [columnId]: Math.max(50, startHeight + deltaY),
          }));
        } else {
          const deltaX = moveEvent.clientX - startX;
          setColumnWidths((prev) => ({
            ...prev,
            [columnId]: Math.max(
              50,
              Math.min(startWidth + deltaX, containerWidth - 50)
            ),
          }));
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [columnWidths, columnHeights]
  );

  const expandColumn = useCallback(
    (columnId) => {
      const containerWidth =
        containerRefs.current[columnId].parentElement.offsetWidth;
      const siblingWidths = Object.values(columnWidths).reduce(
        (sum, width) => sum + width,
        0
      );
      const availableWidth =
        containerWidth - siblingWidths + columnWidths[columnId];
      setColumnWidths((prev) => ({ ...prev, [columnId]: availableWidth }));
    },
    [columnWidths]
  );

  return {
    mainRows,
    columnWidths,
    columnHeights,
    containerWidths,
    containerRefs,
    addColumn,
    addRow,
    deleteColumn,
    deleteRow,
    handleResizeStart,
    expandColumn,
  };
};

export default useEditor;
