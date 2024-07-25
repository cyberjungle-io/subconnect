import React from "react";

const ButtonRenderer = ({ component }) => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded w-full h-full">
      {component.content || "Button"}
    </button>
  );
};

export default ButtonRenderer;