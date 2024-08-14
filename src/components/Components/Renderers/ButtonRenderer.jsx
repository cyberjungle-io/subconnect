import React from "react";

const ButtonRenderer = ({ component, globalSettings }) => {
  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: component.props.backgroundColor || globalSettings.generalComponentStyle.backgroundColor || '#3b82f6',
    color: component.props.color || globalSettings.generalComponentStyle.color || '#ffffff',
    borderRadius: component.props.borderRadius || globalSettings.generalComponentStyle.borderRadius || '0.25rem',
    fontFamily: component.props.fontFamily || globalSettings.generalComponentStyle.fontFamily,
    fontSize: component.props.fontSize || globalSettings.generalComponentStyle.fontSize,
    width: '100%',
    height: '100%',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <button style={buttonStyle}>
      {component.content || "Button"}
    </button>
  );
};

export default ButtonRenderer;