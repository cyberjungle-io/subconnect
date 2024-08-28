import React, { useEffect, useRef } from "react";

const TextRenderer = ({ 
  component, 
  onUpdate, 
  isViewMode, 
  onDoubleClick, 
  isEditing, 
  setIsEditing, 
  globalSettings 
}) => {
  const textRef = useRef(null);

  const getTextStyle = () => {
    const generalComponentStyle = globalSettings?.generalComponentStyle || {};
    return {
      fontFamily: component.style.fontFamily || generalComponentStyle.fontFamily,
      fontSize: component.style.fontSize || generalComponentStyle.fontSize,
      color: component.style.color || generalComponentStyle.color,
      backgroundColor: component.style.backgroundColor || generalComponentStyle.backgroundColor,
      borderRadius: component.style.borderRadius || generalComponentStyle.borderRadius,
      boxShadow: component.style.boxShadow || generalComponentStyle.boxShadow,
      textAlign: component.style.textAlign || 'left',
      fontWeight: component.style.fontWeight || 'normal',
      fontStyle: component.style.fontStyle || 'normal',
      textDecoration: component.style.textDecoration || 'none',
      padding: component.style.padding || '5px',
      ...component.style, // This ensures any specific component styles override the global ones
    };
  };

  const textStyle = getTextStyle();

  const ElementType = component.style.headingLevel || 'p';

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Place cursor at the end of the text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = () => {
    // Don't set isEditing to false on blur
    // This allows the toolbar to remain open
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
      onDoubleClick={onDoubleClick}
      onBlur={handleBlur}
      onInput={handleInput}
      suppressContentEditableWarning={true}
    >
      {component.style.content || "Text Component"}
    </ElementType>
  );
};

export default TextRenderer;