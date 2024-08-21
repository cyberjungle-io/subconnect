import React from "react";

const ButtonRenderer = ({ component, globalSettings }) => {
  const buttonStyle = {
    ...component.style,
    padding: component.style.padding || '0.5rem 1rem',
    backgroundColor: component.style.backgroundColor || globalSettings.generalComponentStyle.backgroundColor || '#3b82f6',
    color: component.style.color || globalSettings.generalComponentStyle.color || '#ffffff',
    borderRadius: component.style.borderRadius || globalSettings.generalComponentStyle.borderRadius || '0.25rem',
    fontFamily: component.style.fontFamily || globalSettings.generalComponentStyle.fontFamily,
    fontSize: component.style.fontSize || globalSettings.generalComponentStyle.fontSize,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    border: component.style.showBorder !== false
      ? `${component.style.borderWidth || '1px'} ${component.style.borderStyle || 'solid'} ${component.style.borderColor || '#000'}`
      : "none",
  };

  return (
    <button style={buttonStyle}>
      {component.content || "Button"}
    </button>
  );
};

export default ButtonRenderer;