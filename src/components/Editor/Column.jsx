import React, { useState } from "react";
import {
  FaTrashAlt,
  FaPlusCircle,
  FaEllipsisV,
  FaExpandArrowsAlt,
  FaArrowsAlt,
  FaFileImport,
  FaArrowsAltH,
  FaArrowsAltV,
} from "react-icons/fa";
import UseEditor from "../../hooks/useEditor";
import ErrorBoundary from "../common/ErrorBoundary";
import ResizeHandle from "./ResizeHandle";
import AddColumnButton from "./AddColumnButton";
import Modal from "../common/Modal";
import ColorPicker from "../common/ColorPicker";
import Dropdown from "../common/Dropdown";

const Column = ({ column, rowIndex, path = [], nestingLevel = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    updateColumnColor,
  } = UseEditor();

  const borderColor = `border-${
    ["gray", "blue", "green", "red", "purple"][nestingLevel % 5]
  }-400`;
  const textColor = `text-${
    ["gray", "blue", "green", "red", "purple"][nestingLevel % 5]
  }-600`;

  const handleAddRow = () => {
    addRow(rowIndex, [...path, column.id]);
  };
  const handleDeleteColumn = () => deleteColumn(rowIndex, [...path, column.id]);
  const handleExpandWidth = () => expandColumnWidth(column.id);
  const handleExpandHeight = () => {
    console.log("Expanding height for column:", {
      id: column.id,
      rowIndex,
      path,
    });
    expandColumnHeight(column.id, rowIndex, path);
  };
  const handleColorSelect = (color) => {
    updateColumnColor(column.id, color);
    setIsModalOpen(false);
  };

  const hasRows = column.rows.length > 0;
  const hasContent = column.content || column.color;
  const isEmpty = !hasRows && !hasContent;

  const dropdownItems = [
    {
      label: "Add Content",
      icon: FaFileImport,
      onClick: () => setIsModalOpen(true),
    },
    {
      label: "Add Row",
      icon: FaPlusCircle,
      onClick: handleAddRow,
    },
    {
      label: "Expand Width",
      icon: FaArrowsAltH,
      onClick: handleExpandWidth,
    },
    {
      label: "Expand Height",
      icon: FaArrowsAltV,
      onClick: handleExpandHeight,
    },
    {
      label: "Delete Column",
      icon: FaTrashAlt,
      onClick: handleDeleteColumn,
      color: "text-red-600",
    },
  ];

  return (
    <ErrorBoundary>
      <div
        ref={(el) => (containerRefs.current[column.id] = el)}
        className={`relative flex flex-col border ${borderColor} bg-white overflow-hidden`}
        style={{
          width: `${columnWidths[column.id]}px`,
          height: `${columnHeights[column.id]}px`,
          backgroundColor: column.color || "transparent",
        }}
      >
        {/* Column Header */}
        <div
          className={`font-semibold p-2 ${textColor} flex justify-between items-center`}
        >
          <span>{`${"Nested ".repeat(nestingLevel)}Column ${column.id}`}</span>
          <Dropdown
            trigger={
              <button
                className="text-gray-500 hover:text-gray-700"
                title="Column options"
              >
                <FaEllipsisV size={16} />
              </button>
            }
            items={dropdownItems}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-auto p-2 relative">
          {hasRows ? (
            column.rows.map((row, idx) => (
              <div
                key={row.id}
                className="border border-gray-300 p-2 mb-2 bg-gray-50"
              >
                <div className="font-semibold mb-2 flex justify-between items-center">
                  <span>{`${"Nested ".repeat(nestingLevel + 1)}Row ${
                    row.id
                  }`}</span>
                  <button
                    onClick={() =>
                      deleteRow(rowIndex, [...path, column.id, idx])
                    }
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
                    onClick={() =>
                      addColumn(rowIndex, [...path, column.id, idx])
                    }
                    isNested={true}
                    borderColor={borderColor}
                    textColor={textColor}
                  />
                </div>
              </div>
            ))
          ) : !hasContent ? (
            <div className="flex items-center justify-center h-full">
              {/* Content Picker Button (centered when no content and no rows) */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                title="Add content"
              >
                <FaFileImport size={24} />
              </button>
            </div>
          ) : null}

          {/* Display content here if it exists */}
          {hasContent && !hasRows && (
            <div className="h-full flex items-center justify-center">
              {/* Replace this with actual content rendering */}
              <span className="text-gray-500">Content goes here</span>
            </div>
          )}
        </div>

        {/* Add Row Button (only visible when column is empty) */}
        {isEmpty && (
          <div className="p-3">
            <button
              onClick={handleAddRow}
              className={`flex items-center justify-center w-full border-2 border-dashed ${borderColor} p-2 ${textColor} hover:bg-gray-50 transition-colors`}
            >
              <FaPlusCircle className="mr-2" size={16} />
              <span>Add Row</span>
            </button>
          </div>
        )}

        <ResizeHandle
          onMouseDown={(e) => handleResizeStart(e, column.id, false)}
          isVertical={false}
        />
        <ResizeHandle
          onMouseDown={(e) => handleResizeStart(e, column.id, true)}
          isVertical={true}
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ColorPicker onColorSelect={handleColorSelect} />
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default Column;
