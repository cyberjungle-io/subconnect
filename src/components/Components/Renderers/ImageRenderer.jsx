import React from "react";

const ImageRenderer = ({ component }) => {
  return (
    <img
      src={component.content || "https://via.placeholder.com/150"}
      alt="placeholder"
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
      }}
    />
  );
};

export default ImageRenderer;