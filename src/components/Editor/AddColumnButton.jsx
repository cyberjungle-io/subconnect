import React from "react";
import {  FaPlusCircle } from 'react-icons/fa';

const AddColumnButton = ({
  onClick,
  isNested = false,
  borderColor,
  textColor,
}) => {
  const baseClasses = isNested
    ? `flex items-center justify-center border-2 border-dashed ${borderColor} p-2 flex-grow basis-0 min-w-[100px] transition-colors`
    : "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-2 w-[200px] h-[200px] bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors";

  const nestedClasses = isNested
    ? `bg-${
        ["gray", "blue", "green", "red", "purple"][
          Math.floor(borderColor.length / 4) % 5
        ]
      }-50 ${textColor} hover:bg-${
        ["gray", "blue", "green", "red", "purple"][
          Math.floor(borderColor.length / 4) % 5
        ]
      }-100`
    : "";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${nestedClasses}`}
      title="Add new column"
    >
      <FaPlusCircle
        className={isNested ? "mr-1" : "mb-1"}
        size={isNested ? 16 : 24}
      />
      <span className="text-sm">Add Column</span>
    </button>
  );
};

export default AddColumnButton;
