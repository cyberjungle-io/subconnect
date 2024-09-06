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
      textRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && textRef.current) {
      const length = textRef.current.textContent.length;
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(textRef.current.firstChild || textRef.current, length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      textRef.current.focus();
    }
  }, [isEditing]);

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
      // Get cursor position relative to text content
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const caretOffset = preCaretRange.toString().length;

      setLocalContent(sanitizedContent);
      onUpdate(component.id, { style: { ...component.style, content: sanitizedContent } });

      // Restore cursor position
      setTimeout(() => {
        const textNode = element.firstChild;
        if (textNode) {
          const newRange = document.createRange();
          newRange.setStart(textNode, Math.min(caretOffset, textNode.length));
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && textRef.current.innerText.trim() === '') {
      e.preventDefault();
    }
  };

  // Add this new function
  const placeCaretAtEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
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
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(localContent) }}
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