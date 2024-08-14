import React from "react";

const TextRenderer = ({ component, globalSettings }) => {
  const textStyle = {
    fontFamily: globalSettings.generalComponentStyle.fontFamily,
    fontSize: globalSettings.generalComponentStyle.fontSize,
    color: component.props.color || globalSettings.generalComponentStyle.color,
    backgroundColor: globalSettings.generalComponentStyle.backgroundColor,
    borderRadius: globalSettings.generalComponentStyle.borderRadius,
    boxShadow: globalSettings.generalComponentStyle.boxShadow,
  };

  return (
    <p className="w-full h-full overflow-hidden" style={textStyle}>
      {component.content || "Text Component"}
    </p>
  );
};

export default TextRenderer;