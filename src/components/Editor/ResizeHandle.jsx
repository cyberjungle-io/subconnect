import React from "react";

const ResizeHandle = ({ onMouseDown, isVertical }) => {
  const baseClasses =
    "absolute bg-blue-500 opacity-50 hover:opacity-100 transition-opacity z-20";
  const orientationClasses = isVertical
    ? "bottom-0 left-0 right-0 h-2 cursor-row-resize"
    : "top-0 right-0 bottom-0 w-2 cursor-col-resize";

  return (
    <div
      className={`${baseClasses} ${orientationClasses}`}
      onMouseDown={onMouseDown}
      title={isVertical ? "Resize column height" : "Resize column width"}
    />
  );
};

export default ResizeHandle;