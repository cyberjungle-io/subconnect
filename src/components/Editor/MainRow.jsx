import React, { useContext } from "react";
import { Trash2 } from "lucide-react";
import EditorContext from "./EditorContext";
import ErrorBoundary from "./ErrorBoundary";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";

const MainRow = ({ mainRow, rowIndex, onDeleteMainRow }) => {
  const { containerRefs, containerWidths, columnWidths, addColumn } =
    useContext(EditorContext);

  const handleAddColumn = () => {
    addColumn(rowIndex);
  };

  const canAddColumn =
    containerWidths[mainRow.id] &&
    containerWidths[mainRow.id] -
      mainRow.columns.reduce(
        (sum, col) => sum + (columnWidths[col.id] || 0),
        0
      ) >=
      220;

  return (
    <ErrorBoundary>
      <div
        className="border border-gray-300 p-4 mb-4"
        ref={(el) => (containerRefs.current[mainRow.id] = el)}
      >
        <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
          <span>Main Row {mainRow.id}</span>
          {rowIndex > 0 && (
            <button
              onClick={() => onDeleteMainRow(rowIndex)}
              className="text-gray-500 hover:text-red-500"
              title="Delete main row"
            >
              <Trash2 size={20} />
            </button>
          )}
        </h2>

        <div className="flex gap-2">
          {mainRow.columns.map((column) => (
            <Column key={column.id} column={column} rowIndex={rowIndex} />
          ))}

          {canAddColumn && <AddColumnButton onClick={handleAddColumn} />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MainRow;
