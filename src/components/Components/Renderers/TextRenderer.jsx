import React from "react";

const TextRenderer = ({ component, globalSettings }) => {
  const textStyle = {
    fontFamily: component.style.fontFamily || globalSettings.generalComponentStyle.fontFamily,
    fontSize: component.style.fontSize || globalSettings.generalComponentStyle.fontSize,
    color: component.style.color || globalSettings.generalComponentStyle.color,
    backgroundColor: component.style.backgroundColor || globalSettings.generalComponentStyle.backgroundColor,
    borderRadius: component.style.borderRadius || globalSettings.generalComponentStyle.borderRadius,
    boxShadow: component.style.boxShadow || globalSettings.generalComponentStyle.boxShadow,
    textAlign: component.style.textAlign || 'left',
    fontWeight: component.style.fontWeight || 'normal',
    fontStyle: component.style.fontStyle || 'normal',
    textDecoration: component.style.textDecoration || 'none',
  };

  const ElementType = component.style.headingLevel || 'p';

  return (
    <ElementType className="w-full h-full overflow-hidden" style={textStyle}>
      {component.style.content || "Text Component"}
    </ElementType>
  );
};

export default TextRenderer;