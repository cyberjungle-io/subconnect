import React from "react";

const ResizeHandle = ({ onMouseDown, isVertical }) => {
  // Base classes for both vertical and horizontal handles
  const baseClasses = "absolute z-20";
  
  // Classes specific to vertical or horizontal orientation
  const orientationClasses = isVertical
    ? "bottom-0 left-0 right-0 h-1.5 cursor-row-resize" // Vertical handle (reduced to h-1.5)
    : "top-0 right-0 bottom-0 w-1.5 cursor-col-resize"; // Horizontal handle (reduced to w-1.5)

  // Handle appearance
  const handleAppearance = "bg-gray-300 hover:bg-gray-400 transition-colors duration-150";

  return (
    <div
      className={`${baseClasses} ${orientationClasses} ${handleAppearance}`}
      onMouseDown={onMouseDown}
      title={isVertical ? "Resize column height" : "Resize column width"}
    >
      {/* Dots for additional visual cue */}
      <div className={`absolute ${isVertical ? 'top-0 left-1/2 w-1.5 h-full' : 'left-0 top-1/2 h-1.5 w-full'} flex ${isVertical ? 'flex-col' : 'flex-row'} justify-center items-center gap-1`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`bg-gray-500 rounded-full ${isVertical ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default ResizeHandle;