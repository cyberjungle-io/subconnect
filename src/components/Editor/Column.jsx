import React from "react";
import {
  FaTrashAlt,
  FaArrowsAltH,
  FaArrowsAltV,
  FaPlusCircle,
} from "react-icons/fa";
import UseEditor from "../../hooks/useEditor";
import ErrorBoundary from "../common/ErrorBoundary";
import ResizeHandle from "./ResizeHandle";
import AddColumnButton from "./AddColumnButton";

const Column = ({ column, rowIndex, path = [], nestingLevel = 0 }) => {
  const {
    columnWidths,
    columnHeights,
    containerRefs,
    handleResizeStart,
    deleteColumn,
    addRow,
    deleteRow,
    addColumn,
    expandColumnWidth,
    expandColumnHeight,
  } = UseEditor();

  const borderColor = `border-${
    ["gray", "blue", "green", "red", "purple"][nestingLevel % 5]
  }-400`;
  const textColor = `text-${
    ["gray", "blue", "green", "red", "purple"][nestingLevel % 5]
  }-600`;

  const handleAddRow = () => addRow(rowIndex, [...path, column.id]);
  const handleDeleteColumn = () => deleteColumn(rowIndex, [...path, column.id]);
  const handleExpandWidth = () => expandColumnWidth(column.id);
  const handleExpandHeight = () => {
    console.log('Expanding height for column:', { id: column.id, rowIndex, path });
    expandColumnHeight(column.id, rowIndex, path);
  };
  
  return (
    <ErrorBoundary>
      <div
        ref={(el) => (containerRefs.current[column.id] = el)}
        className={`relative flex flex-col border ${borderColor} bg-white overflow-hidden`}
        style={{
          width: `${columnWidths[column.id]}px`,
          height: `${columnHeights[column.id]}px`,
        }}
      >
        {/* Column Header */}
        <div
          className={`font-semibold p-2 ${textColor} flex justify-between items-center`}
        >
          <span>{`${"Nested ".repeat(nestingLevel)}Column ${column.id}`}</span>
          <div>
            <button
              onClick={handleExpandWidth}
              className="mr-2 text-gray-500 hover:text-blue-500"
              title="Expand column width"
            >
              <FaArrowsAltH size={16} />
            </button>
            <button
              onClick={handleExpandHeight}
              className="mr-2 text-gray-500 hover:text-blue-500"
              title="Expand column height"
            >
              <FaArrowsAltV size={16} />
            </button>
            <button
              onClick={handleDeleteColumn}
              className="text-gray-500 hover:text-red-500"
              title="Delete column"
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-auto p-2">
          {column.rows.map((row, idx) => (
            <div
              key={row.id}
              className="border border-gray-300 p-2 mb-2 bg-gray-50"
            >
              <div className="font-semibold mb-2 flex justify-between items-center">
                <span>{`${"Nested ".repeat(nestingLevel + 1)}Row ${
                  row.id
                }`}</span>
                <button
                  onClick={() => deleteRow(rowIndex, [...path, column.id, idx])}
                  className="text-gray-500 hover:text-red-500"
                  title="Delete row"
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {row.columns.map((nestedColumn) => (
                  <Column
                    key={nestedColumn.id}
                    column={nestedColumn}
                    rowIndex={rowIndex}
                    path={[...path, column.id, idx]}
                    nestingLevel={nestingLevel + 1}
                  />
                ))}

                <AddColumnButton
                  onClick={() => addColumn(rowIndex, [...path, column.id, idx])}
                  isNested={true}
                  borderColor={borderColor}
                  textColor={textColor}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 ">
          <button
            onClick={handleAddRow}
            className={`flex items-center justify-center w-full border-2 border-dashed ${borderColor} p-2 ${textColor} hover:bg-gray-50 transition-colors`}
          >
            <FaPlusCircle className="mr-2" size={16} />
            <span>Add Row</span>
          </button>
        </div>

        <ResizeHandle
          onMouseDown={(e) => handleResizeStart(e, column.id, false)}
          isVertical={false}
        />
        <ResizeHandle
          onMouseDown={(e) => handleResizeStart(e, column.id, true)}
          isVertical={true}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Column;
