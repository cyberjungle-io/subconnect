import React from "react";

const ImageRenderer = ({ component, onUpdate, globalSettings }) => {
  const {
    content,
    props: {
      objectFit = "contain",
      alt = "Image",
      shape = "rectangle",
      keepAspectRatio = true,
      borderRadius = "0",
      borderRadiusUnit = "px",
      boxShadowX = "0",
      boxShadowY = "0",
      boxShadowBlur = "0",
      boxShadowColor = "#000000",
    },
    style
  } = component;

  const containerStyle = {
    width: style.width || '200px',
    height: style.height || 'auto',
    minWidth: style.minWidth || 'auto',
    minHeight: style.minHeight || 'auto',
    maxWidth: style.maxWidth || '100%',
    maxHeight: style.maxHeight || '100%',
    display: 'inline-block',
    overflow: 'hidden',
    borderRadius: shape === "circle" ? "50%" : `${borderRadius}${borderRadiusUnit}`,
    boxShadow: `${boxShadowX}px ${boxShadowY}px ${boxShadowBlur}px ${boxShadowColor}`,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit,
  };

  return (
    <div style={containerStyle}>
      <img
        src={content || "https://via.placeholder.com/200"}
        alt={alt}
        style={imageStyle}
      />
    </div>
  );
};

export default ImageRenderer;