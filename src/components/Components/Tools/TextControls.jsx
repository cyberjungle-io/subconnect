import React, { useState, useEffect } from 'react';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaBold, FaItalic, FaUnderline, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { TbOverline, TbStrikethrough } from 'react-icons/tb';
import ColorPicker from '../../common/ColorPicker';

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

const TextControls = ({ style, onStyleChange }) => {
  const [content, setContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [fontColor, setFontColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState('left');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [headingLevel, setHeadingLevel] = useState('p');
  const [letterSpacing, setLetterSpacing] = useState('normal');
  const [lineHeight, setLineHeight] = useState('normal');
  const [textTransform, setTextTransform] = useState('none');
  const [wordSpacing, setWordSpacing] = useState('normal');
  const [textShadow, setTextShadow] = useState({ x: 0, y: 0, blur: 0, color: '#000000' });
  const [hoverEffect, setHoverEffect] = useState('none');
  const [clickAction, setClickAction] = useState('none');
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    advanced: false,
  });

  useEffect(() => {
    if (style) {
      setContent(style.content || '');
      setFontFamily(style.fontFamily || 'Arial, sans-serif');
      setFontSize(style.fontSize || '16px');
      setFontColor(style.color || '#000000');
      setTextAlign(style.textAlign || 'left');
      setFontWeight(style.fontWeight || 'normal');
      setFontStyle(style.fontStyle || 'normal');
      setTextDecoration(style.textDecoration || 'none');
      setHeadingLevel(style.headingLevel || 'p');
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

  const handleFontStyleChange = (styleType) => {
    switch (styleType) {
      case 'bold':
        setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold');
        handleStyleChange({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' });
        break;
      case 'italic':
        setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic');
        handleStyleChange({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' });
        break;
      case 'underline':
      case 'overline':
      case 'line-through':
        const newDecoration = textDecoration.includes(styleType)
          ? textDecoration.replace(styleType, '').trim() || 'none'
          : `${textDecoration === 'none' ? '' : `${textDecoration} `}${styleType}`;
        setTextDecoration(newDecoration);
        handleStyleChange({ textDecoration: newDecoration });
        break;
      default:
        break;
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const parseShadow = (shadowString) => {
    const [x, y, blur, color] = shadowString.split(' ');
    return { x: parseInt(x), y: parseInt(y), blur: parseInt(blur), color };
  };

  const renderGeneralControls = () => (
    <div className="control-section-content">
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleStyleChange({ content: e.target.value });
          }}
          className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value);
            handleStyleChange({ fontFamily: e.target.value });
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {FONT_OPTIONS.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Element Type</label>
        <select
          value={headingLevel}
          onChange={(e) => {
            setHeadingLevel(e.target.value);
            handleStyleChange({ headingLevel: e.target.value });
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="p">Paragraph</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
        <input
          type="text"
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            handleStyleChange({ fontSize: e.target.value });
          }}
          className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Color</label>
        <ColorPicker
          color={fontColor}
          onChange={(color) => {
            setFontColor(color);
            handleStyleChange({ color });
          }}
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Text Align</label>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setTextAlign('left');
              handleStyleChange({ textAlign: 'left' });
            }}
            className={`p-1 ${textAlign === 'left' ? 'bg-gray-200' : ''}`}
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() => {
              setTextAlign('center');
              handleStyleChange({ textAlign: 'center' });
            }}
            className={`p-1 ${textAlign === 'center' ? 'bg-gray-200' : ''}`}
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() => {
              setTextAlign('right');
              handleStyleChange({ textAlign: 'right' });
            }}
            className={`p-1 ${textAlign === 'right' ? 'bg-gray-200' : ''}`}
          >
            <FaAlignRight />
          </button>
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Style</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFontStyleChange('bold')}
            className={`p-1 ${fontWeight === 'bold' ? 'bg-gray-200' : ''}`}
          >
            <FaBold />
          </button>
          <button
            onClick={() => handleFontStyleChange('italic')}
            className={`p-1 ${fontStyle === 'italic' ? 'bg-gray-200' : ''}`}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => handleFontStyleChange('underline')}
            className={`p-1 ${textDecoration.includes('underline') ? 'bg-gray-200' : ''}`}
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => handleFontStyleChange('overline')}
            className={`p-1 ${textDecoration.includes('overline') ? 'bg-gray-200' : ''}`}
          >
            <TbOverline />
          </button>
          <button
            onClick={() => handleFontStyleChange('line-through')}
            className={`p-1 ${textDecoration.includes('line-through') ? 'bg-gray-200' : ''}`}
          >
            <TbStrikethrough />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedControls = () => (
    <div className="control-section-content">
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Letter Spacing</label>
        <input
          type="text"
          value={letterSpacing}
          onChange={(e) => {
            setLetterSpacing(e.target.value);
            handleStyleChange({ letterSpacing: e.target.value });
          }}
          className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Line Height</label>
        <input
          type="text"
          value={lineHeight}
          onChange={(e) => {
            setLineHeight(e.target.value);
            handleStyleChange({ lineHeight: e.target.value });
          }}
          className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Text Transform</label>
        <select
          value={textTransform}
          onChange={(e) => {
            setTextTransform(e.target.value);
            handleStyleChange({ textTransform: e.target.value });
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Word Spacing</label>
        <input
          type="text"
          value={wordSpacing}
          onChange={(e) => {
            setWordSpacing(e.target.value);
            handleStyleChange({ wordSpacing: e.target.value });
          }}
          className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Text Shadow</label>
        <div className="flex space-x-1">
          <input
            type="number"
            placeholder="X"
            value={textShadow.x}
            onChange={(e) => setTextShadow(prev => ({ ...prev, x: e.target.value }))}
            onBlur={() => handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` })}
            className="w-1/4 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Y"
            value={textShadow.y}
            onChange={(e) => setTextShadow(prev => ({ ...prev, y: e.target.value }))}
            onBlur={() => handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` })}
            className="w-1/4 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Blur"
            value={textShadow.blur}
            onChange={(e) => setTextShadow(prev => ({ ...prev, blur: e.target.value }))}
            onBlur={() => handleStyleChange({ textShadow: `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}` })}
            className="w-1/4 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Hover Effect</label>
        <select
          value={hoverEffect}
          onChange={(e) => {
            setHoverEffect(e.target.value);
            handleStyleChange({ hoverEffect: e.target.value });
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="color">Color Change</option>
          <option value="scale">Scale</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Click Action</label>
        <select
          value={clickAction}
          onChange={(e) => {
            setClickAction(e.target.value);
            handleStyleChange({ clickAction: e.target.value });
          }}
          className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="none">None</option>
          <option value="smoothScroll">Smooth Scroll</option>
          <option value="openModal">Open Modal</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="text-controls">
      <div className="control-section">
        <div className="control-section-header" onClick={() => toggleSection('general')}>
          <span>General</span>
          {expandedSections.general ? <FaChevronDown /> : <FaChevronRight />}
        </div>
        {expandedSections.general && renderGeneralControls()}
      </div>
      <div className="control-section">
        <div className="control-section-header" onClick={() => toggleSection('advanced')}>
          <span>Advanced</span>
          {expandedSections.advanced ? <FaChevronDown /> : <FaChevronRight />}
        </div>
        {expandedSections.advanced && renderAdvancedControls()}
      </div>
    </div>
  );
};

export default TextControls;