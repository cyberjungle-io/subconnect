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
  const contentRef = useRef(component.content || '');
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
      display: 'block'
    };
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: component.style.backgroundColor || 'transparent',
    borderWidth: component.style.borderWidth || '1px',
    borderStyle: component.style.borderStyle || 'solid',
    borderColor: component.style.borderColor || '#e2e8f0',
    ...(component.style.borderWidth === '0px' && {
      border: 'none',
      borderWidth: '0px',
      borderStyle: 'none',
      borderColor: 'transparent'
    }),
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
    if (textRef.current) {
      const contentToUse = component.content || component.props?.content || '';
      const sanitizedContent = DOMPurify.sanitize(contentToUse);
      textRef.current.innerHTML = sanitizedContent;
      contentRef.current = contentToUse;
    }
  }, [component.content, component.props?.content]);

  const handleFocus = () => {
    // Remove setShowPlaceholder(false);
  };

  const handleBlur = () => {
    // Remove placeholder-related logic
  };

  const handleInput = (e) => {
    const element = e.target;
    const newContent = element.innerHTML;
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const sanitizedContent = sanitizeHtml(newContent);
      
      if (validateHtmlContent(sanitizedContent)) {
        contentRef.current = sanitizedContent;
        
        const updatedComponent = {
          ...component,
          content: sanitizedContent,
          props: {
            ...component.props,
            content: sanitizedContent,
          },
          style: {
            ...component.style,
          }
        };

        onUpdate(component.id, updatedComponent);
      }
    }, 100);
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
        dangerouslySetInnerHTML={isEditing ? undefined : { __html: DOMPurify.sanitize(component.content || component.props?.content || '') }}
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
