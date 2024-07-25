import React from "react";

const TextRenderer = ({ component }) => {
  return (
    <p className="w-full h-full overflow-hidden">
      {component.content || "Text Component"}
    </p>
  );
};

export default TextRenderer;