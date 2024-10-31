import React from "react";

const ImageRenderer = ({ component, onUpdate, globalSettings }) => {
  const {
    content,
    props: {
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

  // Main container takes full size of parent
  const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: style.backgroundColor || 'transparent',
    borderRadius: shape === "circle" ? "50%" : `${borderRadius}${borderRadiusUnit}`,
    boxShadow: `${boxShadowX}px ${boxShadowY}px ${boxShadowBlur}px ${boxShadowColor}`,
  };

  // Image style handles the actual image sizing within the container
  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: keepAspectRatio ? 'auto' : '100%',
    height: keepAspectRatio ? 'auto' : '100%',
    objectFit: style.objectFit || (keepAspectRatio ? 'contain' : 'cover'),
    borderRadius: shape === "circle" ? "50%" : `${borderRadius}${borderRadiusUnit}`,
  };

  return (
    <div style={containerStyle}>
      <img
        src={style.src || content || "https://via.placeholder.com/200"}
        alt={alt}
        style={imageStyle}
      />
    </div>
  );
};

export default ImageRenderer;