import React from "react";
import { Trash2 } from "lucide-react";
import UseEditor from "../hooks/useEditor";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";
import ErrorBoundary from "./ErrorBoundary";

const NestedRow = ({ row, rowIndex, columnId, path, nestingLevel }) => {
  const { deleteRow, addColumn } = UseEditor();

  const borderColor = `border-${
    ["gray", "blue", "green", "red", "purple"][nestingLevel % 5]
  }-400`;
  const textColor = `text-${
    ["gray", "blue", "green", "red", "purple"][nestingLevel % 5]
  }-600`;

  const handleDeleteRow = () =>
    deleteRow(rowIndex, [...path, columnId, row.id]);
  const handleAddColumn = () =>
    addColumn(rowIndex, [...path, columnId, row.id]);

  return (
    <ErrorBoundary>
      <div className="border border-gray-300 p-2 mb-2 bg-gray-50">
        <div className="font-semibold mb-2 flex justify-between items-center">
          <span>{`${"Nested ".repeat(nestingLevel)}Row ${row.id}`}</span>
          <button
            onClick={handleDeleteRow}
            className="text-gray-500 hover:text-red-500"
            title="Delete row"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {row.columns.map((nestedColumn) => (
            <Column
              key={nestedColumn.id}
              column={nestedColumn}
              rowIndex={rowIndex}
              path={[...path, columnId, row.id]}
              nestingLevel={nestingLevel + 1}
            />
          ))}

          <AddColumnButton
            onClick={handleAddColumn}
            isNested={true}
            borderColor={borderColor}
            textColor={textColor}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NestedRow;
