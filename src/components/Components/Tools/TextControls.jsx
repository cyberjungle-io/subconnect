import React, { useState, useEffect } from 'react';
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
  const [hoverEffect, setHoverEffect] = useState('none');
  const [clickAction, setClickAction] = useState('none');

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
      setHoverEffect(style.hoverEffect || 'none');
      setClickAction(style.clickAction || 'none');
    }
  }, [style]);

  const handleStyleChange = (updates) => {
    onStyleChange({ ...style, ...updates });
  };

  const applyStyleToSelection = (styleType) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let tag;
      switch (styleType) {
        case 'bold':
          tag = 'strong';
          break;
        case 'italic':
          tag = 'em';
          break;
        case 'underline':
          tag = 'u';
          break;
        case 'overline':
        case 'line-through':
          tag = 'span';
          break;
        default:
          return;
      }

      const newNode = document.createElement(tag);
      if (styleType === 'overline' || styleType === 'line-through') {
        newNode.style.textDecoration = styleType;
      }
      range.surroundContents(newNode);
      const newContent = sanitizeHtml(document.querySelector('[contenteditable="true"]').innerHTML);
      
      if (validateHtmlContent(newContent)) {
        handleStyleChange({ content: newContent });
      } else {
        console.error('Invalid HTML content detected');
        // Optionally, revert changes or notify the user
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
                  (styleType === 'bold' && fontWeight === 'bold') ||
                  (styleType === 'italic' && fontStyle === 'italic') ||
                  (styleType === 'underline' && textDecoration.includes('underline')) ||
                  (styleType === 'overline' && textDecoration.includes('overline')) ||
                  (styleType === 'line-through' && textDecoration.includes('line-through'))
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
            <input
              type="text"
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                handleStyleChange({ fontSize: e.target.value });
              }}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
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
          <input
            type="text"
            value={letterSpacing}
            onChange={(e) => {
              setLetterSpacing(e.target.value);
              handleStyleChange({ letterSpacing: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
          <input
            type="text"
            value={lineHeight}
            onChange={(e) => {
              setLineHeight(e.target.value);
              handleStyleChange({ lineHeight: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
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
          <input
            type="text"
            value={wordSpacing}
            onChange={(e) => {
              setWordSpacing(e.target.value);
              handleStyleChange({ wordSpacing: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Shadow</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="X"
              value={textShadow.x}
              onChange={(e) => setTextShadow(prev => ({ ...prev, x: e.target.value }))}
              onBlur={() => handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` })}
              className="w-1/4 p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Y"
              value={textShadow.y}
              onChange={(e) => setTextShadow(prev => ({ ...prev, y: e.target.value }))}
              onBlur={() => handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` })}
              className="w-1/4 p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Blur"
              value={textShadow.blur}
              onChange={(e) => setTextShadow(prev => ({ ...prev, blur: e.target.value }))}
              onBlur={() => handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` })}
              className="w-1/4 p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ColorPicker
              color={textShadow.color}
              onChange={(color) => {
                setTextShadow(prev => ({ ...prev, color }));
                handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${color}` });
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hover Effect</label>
          <select
            value={hoverEffect}
            onChange={(e) => {
              setHoverEffect(e.target.value);
              handleStyleChange({ hoverEffect: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="color">Color Change</option>
            <option value="scale">Scale</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Click Action</label>
          <select
            value={clickAction}
            onChange={(e) => {
              setClickAction(e.target.value);
              handleStyleChange({ clickAction: e.target.value });
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="none">None</option>
            <option value="smoothScroll">Smooth Scroll</option>
            <option value="openModal">Open Modal</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextControls;