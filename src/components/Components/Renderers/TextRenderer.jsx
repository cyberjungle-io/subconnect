import React, { useEffect, useRef, useState } from "react";
import { sanitizeHtml } from '../../../utils/sanitize';
import { validateHtmlContent } from '../../../utils/validate';
import TextControls from '../Tools/TextControls';

const TextRenderer = ({ 
  component, 
  onUpdate, 
  isViewMode, 
  onDoubleClick, 
  isEditing, 
  setIsEditing, 
  globalSettings,
  isToolbarOpen
}) => {
  const textRef = useRef(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!component.style.content);
  const [localContent, setLocalContent] = useState(component.style.content || '');

  const getTextStyle = () => {
    const generalComponentStyle = globalSettings?.generalComponentStyle || {};
    return {
      fontFamily: component.style.fontFamily || generalComponentStyle.fontFamily,
      fontSize: component.style.fontSize || generalComponentStyle.fontSize,
      color: component.style.color || generalComponentStyle.color || '#000000', // Default to black
      backgroundColor: component.style.backgroundColor || generalComponentStyle.backgroundColor,
      borderRadius: component.style.borderRadius || generalComponentStyle.borderRadius,
      boxShadow: component.style.boxShadow || generalComponentStyle.boxShadow,
      textAlign: component.style.textAlign || 'left',
      fontWeight: component.style.fontWeight || 'normal',
      fontStyle: component.style.fontStyle || 'normal',
      textDecoration: component.style.textDecoration || 'none',
      padding: component.style.padding || '5px',
      cursor: isEditing ? 'text' : 'default',
      ...component.style,
    };
  };

  const textStyle = getTextStyle();

  const ElementType = component.style.headingLevel || 'p';

  const getPlaceholderText = () => {
    if (!isToolbarOpen && !isEditing) {
      return "Double Tap to Open Toolbar";
    } else if (isToolbarOpen && !isEditing) {
      return "Double Tap to Type Text";
    } else if (isEditing) {
      return "Type Text";
    }
    return "";
  };

  const placeholderText = getPlaceholderText();

  useEffect(() => {
    setLocalContent(component.style.content || '');
    setShowPlaceholder(!component.style.content);
  }, [component.style.content]);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    if (!localContent.trim()) {
      setShowPlaceholder(true);
    }
  };

  const handleInput = (e) => {
    const newContent = e.target.innerText;
    setLocalContent(newContent);
    setShowPlaceholder(!newContent.trim());
    const sanitizedContent = sanitizeHtml(newContent);
    if (validateHtmlContent(sanitizedContent)) {
      onUpdate(component.id, { style: { ...component.style, content: sanitizedContent } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && textRef.current.innerText.trim() === '') {
      e.preventDefault();
    }
  };

  return (
    <>
      <ElementType
        ref={textRef}
        className="w-full h-full overflow-hidden"
        style={{
          ...textStyle,
          color: showPlaceholder ? '#999' : (component.style.color || '#000000'), // Use placeholder color only when showing placeholder
        }}
        contentEditable={isEditing}
        onDoubleClick={onDoubleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {showPlaceholder ? placeholderText : sanitizeHtml(localContent)}
      </ElementType>
      {isToolbarOpen && !isViewMode && (
        <TextControls
          style={component.style}
          onStyleChange={(newStyle) => onUpdate(component.id, { style: newStyle })}
          isToolbarOpen={isToolbarOpen}
        />
      )}
    </>
  );
};

export default TextRenderer;