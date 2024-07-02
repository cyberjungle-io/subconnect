import React from "react";

const ResizeHandle = ({ onMouseDown, isVertical }) => {
  const baseClasses =
    "absolute bg-gray-300 hover:bg-blue-500 transition-colors";
  const orientationClasses = isVertical
    ? "bottom-0 left-0 w-full h-1 cursor-row-resize"
    : "top-0 right-0 w-1 h-full cursor-col-resize";

  return (
    <div
      className={`${baseClasses} ${orientationClasses}`}
      onMouseDown={onMouseDown}
      title={isVertical ? "Resize row height" : "Resize column width"}
    />
  );
};

export default ResizeHandle;
