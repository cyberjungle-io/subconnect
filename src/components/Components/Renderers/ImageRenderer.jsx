import React, { useState, useEffect } from "react";

const ImageRenderer = ({ component, globalSettings }) => {
  const {
    content,
    props: {
      objectFit = "contain",
      borderRadius,
      boxShadowX = 0,
      boxShadowY = 0,
      boxShadowBlur = 0,
      boxShadowColor = "#000000",
      alt = "Image",
      shape = "rectangle",
      keepAspectRatio = false
    },
    style: {
      width,
      height
    }
  } = component;

  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (keepAspectRatio && content) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = content;
    }
  }, [content, keepAspectRatio]);

  const boxShadow = `${boxShadowX}px ${boxShadowY}px ${boxShadowBlur}px ${boxShadowColor}`;

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    lineHeight: 0, // Removes any extra space below the image
  };

  const imageStyle = {
    display: 'block',
    width: width || 'auto',
    height: height || 'auto',
    objectFit,
  };

  if (keepAspectRatio && aspectRatio) {
    if (width && !height) {
      imageStyle.height = `${parseFloat(width) / aspectRatio}px`;
    } else if (height && !width) {
      imageStyle.width = `${parseFloat(height) * aspectRatio}px`;
    }
  }

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: shape === "circle" ? "50%" : (borderRadius ? `${borderRadius}${component.props.borderRadiusUnit || 'px'}` : '0'),
    boxShadow,
    pointerEvents: 'none', // Allows clicking through to the image
  };

  return (
    <div style={containerStyle}>
      <img
        src={content || "https://via.placeholder.com/150"}
        alt={alt}
        style={imageStyle}
      />
      <div style={overlayStyle}></div>
    </div>
  );
};

export default ImageRenderer;