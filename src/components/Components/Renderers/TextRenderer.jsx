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
      color: component.style.color || generalComponentStyle.color || '#000000',
      backgroundColor: 'transparent', // Let parent handle background
      textAlign: component.style.textAlign || 'left',
      fontWeight: component.style.fontWeight || 'normal',
      fontStyle: component.style.fontStyle || 'normal',
      textDecoration: component.style.textDecoration || 'none',
      padding: '5px',
      cursor: isEditing ? 'text' : 'default',
      overflow: 'hidden',
      wordWrap: 'break-word'
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
      onUpdate(component.id, { 
        style: { 
          ...component.style, 
          content: sanitizedContent,
          height: 'auto', // Set height to 'auto' when content changes
        } 
      });
    } else {
      console.warn('Invalid HTML content:', newContent);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && textRef.current.innerText.trim() === '') {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full h-full relative">
      <ElementType
        ref={textRef}
        className="w-full h-full"
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
        <div className="absolute top-full left-0 z-10 w-full">
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
        </div>
      )}
    </div>
  );
};

export default TextRenderer;
