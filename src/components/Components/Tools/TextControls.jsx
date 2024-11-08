import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { TbOverline, TbStrikethrough } from 'react-icons/tb';
import ColorPicker from '../../common/ColorPicker';
import { sanitizeHtml } from '../../../utils/sanitize';
import { validateHtmlContent } from '../../../utils/validate';

const FONT_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
  { value: '"Arial Black", Gadget, sans-serif', label: 'Arial Black' },
  { value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', label: 'Palatino' },
  { value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', label: 'Lucida Sans' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: '"Gill Sans", "Gill Sans MT", sans-serif', label: 'Gill Sans' },
  { value: 'Impact, Charcoal, sans-serif', label: 'Impact' },
  { value: '"Century Gothic", sans-serif', label: 'Century Gothic' },
  { value: 'custom', label: 'Custom Font' },
];

const ELEMENT_TYPES = [
  { value: 'p', label: 'Paragraph', defaultSize: '16px' },
  { value: 'h1', label: 'Heading 1', defaultSize: '32px' },
  { value: 'h2', label: 'Heading 2', defaultSize: '24px' },
  { value: 'h3', label: 'Heading 3', defaultSize: '18.72px' },
  { value: 'h4', label: 'Heading 4', defaultSize: '16px' },
  { value: 'h5', label: 'Heading 5', defaultSize: '13.28px' },
  { value: 'h6', label: 'Heading 6', defaultSize: '10.72px' },
];

const UNITS = ['px', '%', 'em', 'rem', 'pt'];

const LETTER_SPACING_UNITS = ['px', 'em', 'rem'];

const LINE_HEIGHT_UNITS = ['', 'px', 'em', 'rem', '%'];

const TextControls = ({ style, onStyleChange, isToolbarOpen }) => {
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [fontColor, setFontColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState('left');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [elementType, setElementType] = useState('p');
  const [letterSpacing, setLetterSpacing] = useState('normal');
  const [lineHeight, setLineHeight] = useState('normal');
  const [textTransform, setTextTransform] = useState('none');
  const [wordSpacing, setWordSpacing] = useState('normal');
  const [textShadow, setTextShadow] = useState({ x: 0, y: 0, blur: 0, color: '#000000' });
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    if (style) {
      setFontFamily(style.fontFamily || 'Arial, sans-serif');
      setFontSize(style.fontSize || '16px');
      setFontColor(style.color || '#000000');
      setTextAlign(style.textAlign || 'left');
      setFontWeight(style.fontWeight || 'normal');
      setFontStyle(style.fontStyle || 'normal');
      setTextDecoration(style.textDecoration || 'none');
      setElementType(style.elementType || 'p');
      setLetterSpacing(style.letterSpacing || 'normal');
      setLineHeight(style.lineHeight || 'normal');
      setTextTransform(style.textTransform || 'none');
      setWordSpacing(style.wordSpacing || 'normal');
      setTextShadow(style.textShadow ? parseShadow(style.textShadow) : { x: 0, y: 0, blur: 0, color: '#000000' });
    }
  }, [style]);

  const handleStyleChange = (updates) => {
    const updatedStyle = { ...style, ...updates };
    onStyleChange(updatedStyle);
  };

  const isStyleActiveInSelection = (styleType) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer;
    
    // Move up to element node if we're in a text node
    if (container.nodeType === 3) {
      container = container.parentNode;
    }

    // Simple check for the exact style tag
    const styleTag = {
      'bold': ['B', 'STRONG'],
      'italic': ['I', 'EM'],
      'underline': ['U'],
      'overline': ['SPAN'],
      'line-through': ['SPAN']
    }[styleType] || [];

    // Check if we're directly inside the style tag
    if (styleTag.includes(container.tagName)) {
      return true;
    }

    // Check if any parent has the style
    let parent = container;
    while (parent && parent.contentEditable !== 'true') {
      if (styleTag.includes(parent.tagName)) {
        return true;
      }
      parent = parent.parentNode;
    }

    return false;
  };

  const applyStyleToSelection = (styleType) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    const range = selection.getRangeAt(0);
    const editableElement = document.querySelector('[contenteditable="true"]');
    const isActive = isStyleActiveInSelection(styleType);

    if (isActive) {
      // Remove style
      document.execCommand('styleWithCSS', false, false);
      switch (styleType) {
        case 'bold':
          document.execCommand('bold', false);
          break;
        case 'italic':
          document.execCommand('italic', false);
          break;
        case 'underline':
          document.execCommand('underline', false);
          break;
        // Add other cases as needed
      }
    } else {
      // Apply style
      document.execCommand('styleWithCSS', false, false);
      switch (styleType) {
        case 'bold':
          document.execCommand('bold', false);
          break;
        case 'italic':
          document.execCommand('italic', false);
          break;
        case 'underline':
          document.execCommand('underline', false);
          break;
        // Add other cases as needed
      }
    }

    // Force content update
    if (editableElement) {
      const newContent = sanitizeHtml(editableElement.innerHTML);
      if (validateHtmlContent(newContent)) {
        handleStyleChange({ content: newContent });
      }
    }
  };

  const handleFontStyleChange = (styleType) => {
    applyStyleToSelection(styleType);
  };

  const parseShadow = (shadowString) => {
    const [x, y, blur, color] = shadowString.split(' ');
    return { x: parseInt(x), y: parseInt(y), blur: parseInt(blur), color };
  };

  const handleElementTypeChange = (newElementType) => {
    const selectedType = ELEMENT_TYPES.find(type => type.value === newElementType);
    setElementType(newElementType);
    setFontSize(selectedType.defaultSize);
    handleStyleChange({ elementType: newElementType, fontSize: selectedType.defaultSize });
  };

  const handleKeyDown = useCallback((e, setValue, currentValue, onChange) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      let numericPart = 0;
      let unit = 'px';

      if (currentValue) {
        const match = currentValue.match(/^(\d*\.?\d+)(\D*)$/);
        if (match) {
          numericPart = parseFloat(match[1]);
          unit = match[2] || 'px';
        }
      }

      let newValue = numericPart;

      if (e.key === 'ArrowUp') {
        newValue += step;
      } else {
        newValue = Math.max(0, newValue - step);
      }

      const finalValue = `${newValue}${unit}`;
      setValue(finalValue);
      
      // Clear any pending updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the update
      updateTimeoutRef.current = setTimeout(() => {
        onChange(finalValue);
      }, 100);
    }
  }, []);

  const renderSizeInput = (value, onChange, units = UNITS, className = '') => {
    const stringValue = String(value || '');
    const numericValue = stringValue === 'normal' ? '' : stringValue.replace(/[^0-9.-]/g, '');
    const unit = stringValue === 'normal' ? '' : (stringValue.replace(/[0-9.-]/g, '') || units[0]);

    return (
      <div className={`flex items-center justify-center w-full ${className}`}>
        <div className="flex-grow flex">
          <input
            type="text"
            value={numericValue}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue === '' || /^-?\d*\.?\d*$/.test(newValue)) {
                if (!newValue && !unit) {
                  onChange('normal');
                } else {
                  onChange(newValue ? `${newValue}${unit}` : '');
                }
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, 
              (v) => {
                if (!v && !unit) {
                  onChange('normal');
                } else {
                  onChange(v);
                }
              },
              value,
              onChange
            )}
            onBlur={(e) => {
              if (!e.target.value && unit) {
                onChange(`1.5${unit}`);
              } else if (!e.target.value && !unit) {
                onChange('normal');
              }
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={unit ? "Size" : "normal"}
          />
          <select
            value={unit}
            onChange={(e) => {
              const newUnit = e.target.value;
              if (!newUnit) {
                onChange('normal');
              } else {
                onChange(`${numericValue || '1.5'}${newUnit}`);
              }
            }}
            className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u || 'normal'}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="text-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Text Controls</h3>
      <div className="control-section-content">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
          <div className="flex space-x-2">
            {['bold', 'italic', 'underline', 'overline', 'line-through'].map((styleType) => (
              <button
                key={styleType}
                onClick={() => handleFontStyleChange(styleType)}
                className={`p-2 text-sm rounded-md transition-colors duration-200 border ${
                  isStyleActiveInSelection(styleType)
                    ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                    : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
                }`}
              >
                {styleType === 'bold' && <FaBold />}
                {styleType === 'italic' && <FaItalic />}
                {styleType === 'underline' && <FaUnderline />}
                {styleType === 'overline' && <TbOverline />}
                {styleType === 'line-through' && <TbStrikethrough />}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
          <div className="flex space-x-2">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => {
                  setTextAlign(align);
                  handleStyleChange({ textAlign: align });
                }}
                className={`p-2 text-sm rounded-md transition-colors duration-200 border ${
                  textAlign === align
                    ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                    : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
                }`}
              >
                {align === 'left' && <FaAlignLeft />}
                {align === 'center' && <FaAlignCenter />}
                {align === 'right' && <FaAlignRight />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex mb-4 space-x-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Element Type</label>
            <select
              value={elementType}
              onChange={(e) => handleElementTypeChange(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ELEMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            {renderSizeInput(fontSize, (value) => {
              setFontSize(value);
              handleStyleChange({ fontSize: value });
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              handleStyleChange({ fontFamily: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Color</label>
          <ColorPicker
            color={fontColor}
            onChange={(color) => {
              setFontColor(color);
              handleStyleChange({ color });
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Letter Spacing</label>
          {renderSizeInput(letterSpacing, (value) => {
            setLetterSpacing(value);
            handleStyleChange({ letterSpacing: value });
          }, LETTER_SPACING_UNITS)}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
          {renderSizeInput(lineHeight, (value) => {
            setLineHeight(value);
            handleStyleChange({ lineHeight: value });
          }, LINE_HEIGHT_UNITS)}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Transform</label>
          <select
            value={textTransform}
            onChange={(e) => {
              setTextTransform(e.target.value);
              handleStyleChange({ textTransform: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="none">None</option>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Word Spacing</label>
          {renderSizeInput(wordSpacing, (value) => {
            setWordSpacing(value);
            handleStyleChange({ wordSpacing: value });
          }, LETTER_SPACING_UNITS)}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Shadow</label>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Offset X</label>
                <input
                  type="number"
                  placeholder="X"
                  value={textShadow.x}
                  onChange={(e) => setTextShadow(prev => ({ ...prev, x: e.target.value }))}
                  onBlur={() => handleStyleChange({ 
                    textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` 
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Offset Y</label>
                <input
                  type="number"
                  placeholder="Y"
                  value={textShadow.y}
                  onChange={(e) => setTextShadow(prev => ({ ...prev, y: e.target.value }))}
                  onBlur={() => handleStyleChange({ 
                    textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` 
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Blur</label>
                <input
                  type="number"
                  placeholder="Blur"
                  value={textShadow.blur}
                  onChange={(e) => setTextShadow(prev => ({ ...prev, blur: e.target.value }))}
                  onBlur={() => handleStyleChange({ 
                    textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` 
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Shadow Color</label>
              <ColorPicker
                color={textShadow.color}
                onChange={(color) => {
                  setTextShadow(prev => ({ ...prev, color }));
                  handleStyleChange({ 
                    textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${color}` 
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextControls;