import React, { useState, useEffect, useRef } from "react";

const TextRenderer = ({ component, globalSettings, onUpdate, isSelected, isViewMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef(null);

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
    padding: '5px', // Add some padding for better editing experience
  };

  const ElementType = component.style.headingLevel || 'p';

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e) => {
    if (!isViewMode) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleInput = (e) => {
    onUpdate(component.id, { style: { ...component.style, content: e.target.innerText } });
  };

  return (
    <ElementType
      ref={textRef}
      className="w-full h-full overflow-hidden"
      style={textStyle}
      contentEditable={isEditing}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onInput={handleInput}
      suppressContentEditableWarning={true}
    >
      {component.style.content || "Text Component"}
    </ElementType>
  );
};

export default TextRenderer;