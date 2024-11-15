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

  const handleInput = (e) => {
    const element = e.target;
    const newContent = element.innerHTML;
    
    // Store the cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const offset = range.startOffset;
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    contentRef.current = newContent;

    updateTimeoutRef.current = setTimeout(() => {
      const sanitizedContent = sanitizeHtml(newContent);
      
      if (validateHtmlContent(sanitizedContent)) {
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
        
        // Restore cursor position after the update
        if (textRef.current && textRef.current.childNodes.length > 0) {
          try {
            const newRange = document.createRange();
            const sel = window.getSelection();
            const firstNode = textRef.current.childNodes[0];
            const nodeLength = firstNode.length || 0;
            // Ensure offset doesn't exceed the length of the content
            const safeOffset = Math.min(offset, nodeLength);
            
            newRange.setStart(firstNode, safeOffset);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          } catch (error) {
            console.warn('Failed to restore cursor position:', error);
          }
        }
      }
    }, 300);
  };

  const handleFocus = () => {
    if (textRef.current) {
      const currentContent = component.content || component.props?.content || '';
      if (!textRef.current.innerHTML) {
        textRef.current.innerHTML = DOMPurify.sanitize(currentContent);
      }
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
        onInput={handleInput}
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
              onUpdate(component.id, { 
                content: newContent,
                props: { ...component.props, content: newContent }
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TextRenderer;
