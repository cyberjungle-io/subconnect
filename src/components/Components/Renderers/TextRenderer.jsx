import React, { useEffect, useRef, useState } from "react";
import { sanitizeHtml } from '../../../utils/sanitize';
import { validateHtmlContent } from '../../../utils/validate';
import TextControls from '../Tools/TextControls';
import DOMPurify from 'dompurify'; // Add this import

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
  const [localContent, setLocalContent] = useState(component.style.content || '');

  const getTextStyle = () => {
    const generalComponentStyle = globalSettings?.generalComponentStyle || {};
    return {
      width: '100%',
      height: '100%',
      fontFamily: component.style.fontFamily || generalComponentStyle.fontFamily,
      fontSize: component.style.fontSize || generalComponentStyle.fontSize,
      color: component.style.color || generalComponentStyle.color || '#000000', // Default to black
      backgroundColor: 'transparent',
      borderRadius: 'none',
      boxShadow: 'none',
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

  useEffect(() => {
    setLocalContent(component.style.content || '');
  }, [component.style.content]);

  useEffect(() => {
    if (isEditing && textRef.current) {
      placeCaretAtEnd(textRef.current);
    }
  }, [isEditing]);

  // Replace the existing placeCaretAtEnd function with this improved version
  const placeCaretAtEnd = (element) => {
    if (element) {
      element.focus();
      if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (typeof document.body.createTextRange != "undefined") {
        const textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.collapse(false);
        textRange.select();
      }
    }
  };

  const handleFocus = () => {
    // Remove setShowPlaceholder(false);
  };

  const handleBlur = () => {
    // Remove placeholder-related logic
  };

  const handleInput = (e) => {
    const element = e.target;
    const newContent = element.innerHTML;
    const sanitizedContent = sanitizeHtml(newContent);

    if (validateHtmlContent(sanitizedContent)) {
      setLocalContent(sanitizedContent);
      onUpdate(component.id, { style: { ...component.style, content: sanitizedContent } });

      // Use placeCaretAtEnd instead of trying to restore the exact position
      setTimeout(() => {
        placeCaretAtEnd(element);
      }, 0);
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
        style={textStyle}
        contentEditable={isEditing}
        onDoubleClick={onDoubleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(localContent) }}
      />
      {isToolbarOpen && !isViewMode && (
        <TextControls
          style={component.style}
          onStyleChange={(newStyle) => onUpdate(component.id, { style: newStyle })}
          isToolbarOpen={isToolbarOpen}
          content={localContent}
          onContentChange={(newContent) => {
            setLocalContent(newContent);
            onUpdate(component.id, { style: { ...component.style, content: newContent } });
          }}
        />
      )}
    </>
  );
};

export default TextRenderer;