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
  isToolbarOpen,
  parent
}) => {
  const textRef = useRef(null);
  const contentRef = useRef(component.style.content || '');
  const updateTimeoutRef = useRef(null);

  const getTextStyle = () => {
    const generalComponentStyle = globalSettings?.generalComponentStyle || {};
    return {
      width: '100%',
      height: '100%',
      fontFamily: component.style.fontFamily || generalComponentStyle.fontFamily,
      fontSize: component.style.fontSize || generalComponentStyle.fontSize,
      backgroundColor: 'transparent',
      textAlign: component.style.textAlign || 'left',
      fontWeight: component.style.fontWeight || 'normal',
      fontStyle: component.style.fontStyle || 'normal',
      textDecoration: component.style.textDecoration || 'none',
      letterSpacing: component.style.letterSpacing || 'normal',
      padding: '5px',
      cursor: isEditing ? 'text' : 'default',
      overflow: 'auto',
      wordWrap: 'break-word',
      transition: 'color 0.2s ease-in-out',
      minHeight: '100%',
      display: 'block'
    };
  };

  const containerStyle = {
    width: '100%',
    height: component.style.height || '200px',
    position: 'relative',
    backgroundColor: component.style.backgroundColor || 'transparent',
    border: component.style.border || '1px solid #e2e8f0',
    borderRadius: component.style.borderRadius || '4px',
    transition: 'border-color 0.2s ease-in-out'
  };

  if (!isViewMode) {
    containerStyle.hover = {
      borderColor: '#cbd5e1'
    };
  }

  const textStyle = getTextStyle();

  const ElementType = component.style.headingLevel || 'p';

  useEffect(() => {
    if (textRef.current && component.style.content !== contentRef.current) {
      textRef.current.innerHTML = DOMPurify.sanitize(component.style.content || '');
      contentRef.current = component.style.content;
    }
  }, [component.style.content]);

  const handleFocus = () => {
    // Remove setShowPlaceholder(false);
  };

  const handleBlur = () => {
    // Remove placeholder-related logic
  };

  const handleInput = (e) => {
    const element = e.target;
    const newContent = element.innerHTML;
    
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce the update to prevent rapid re-renders
    updateTimeoutRef.current = setTimeout(() => {
      const sanitizedContent = sanitizeHtml(newContent);
      
      if (validateHtmlContent(sanitizedContent)) {
        contentRef.current = sanitizedContent;
        onUpdate(component.id, { 
          style: { 
            ...component.style, 
            content: sanitizedContent,
            height: 'auto',
          } 
        });
      } else {
        console.warn('Invalid HTML content:', newContent);
      }
    }, 100); // Adjust this delay as needed
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && textRef.current.innerText.trim() === '') {
      e.preventDefault();
    }
  };

  return (
    <div style={containerStyle}>
      <ElementType
        ref={textRef}
        className="text-component"
        style={textStyle}
        contentEditable={isEditing}
        onDoubleClick={onDoubleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      />
      {isToolbarOpen && !isViewMode && (
        <div className="absolute top-full left-0 z-10 w-full">
          <TextControls
            style={component.style}
            onStyleChange={(newStyle) => onUpdate(component.id, { style: newStyle })}
            isToolbarOpen={isToolbarOpen}
            content={contentRef.current}
            onContentChange={(newContent) => {
              contentRef.current = newContent;
              onUpdate(component.id, { style: { ...component.style, content: newContent } });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TextRenderer;
