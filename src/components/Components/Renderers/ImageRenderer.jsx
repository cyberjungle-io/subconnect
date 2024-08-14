import React from "react";

const ImageRenderer = ({ component, globalSettings }) => {
  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: component.props.objectFit || "contain",
    borderRadius: component.props.borderRadius || globalSettings.generalComponentStyle.borderRadius || '0',
    boxShadow: component.props.boxShadow || globalSettings.generalComponentStyle.boxShadow || 'none',
  };

  return (
    <img
      src={component.content || "https://via.placeholder.com/150"}
      alt={component.props.alt || "placeholder"}
      style={imageStyle}
    />
  );
};

export default ImageRenderer;