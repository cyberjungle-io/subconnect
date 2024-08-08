import React, { useState } from 'react';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaBold, FaItalic, FaUnderline, FaChevronDown, FaChevronRight, FaUndo } from 'react-icons/fa';
import { TbOverline, TbStrikethrough } from 'react-icons/tb';
import ColorPicker from '../../common/ColorPicker';
import ComponentControls from './ComponentControls';

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

const HeadingControls = ({ component, onUpdate }) => {
  const [customFont, setCustomFont] = useState('');
  const [expandedSections, setExpandedSections] = React.useState({
    general: true,
    advanced: false,
    component: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate({
      props: {
        ...component.props,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const handleStyleChange = (name, value) => {
    onUpdate({
      style: {
        ...component.style,
        [name]: value
      }
    });
  };

  const handleHeadingChange = (level, fontSize) => {
    onUpdate({
      props: {
        ...component.props,
        level: level
      },
      style: {
        ...component.style,
        fontSize: fontSize
      }
    });
  };

  const handleFontStyleChange = (style) => {
    let newProps = { ...component.props };
    
    switch (style) {
      case 'bold':
        newProps.fontWeight = newProps.fontWeight === 'bold' ? 'normal' : 'bold';
        break;
      case 'italic':
        newProps.fontStyle = newProps.fontStyle === 'italic' ? 'normal' : 'italic';
        break;
      case 'underline':
      case 'overline':
      case 'line-through':
        const currentDecoration = newProps.textDecoration || 'none';
        if (currentDecoration.includes(style)) {
          newProps.textDecoration = currentDecoration.replace(style, '').trim();
          if (newProps.textDecoration === '') newProps.textDecoration = 'none';
        } else {
          newProps.textDecoration = currentDecoration === 'none' ? style : `${currentDecoration} ${style}`;
        }
        break;
      default:
        break;
    }

    onUpdate({ props: newProps });
  };

  const handleReset = (property, defaultValue) => {
    onUpdate({
      props: {
        ...component.props,
        [property]: defaultValue
      }
    });
  };

  const renderSection = (title, sectionKey, content) => (
    <div className="mb-4">
      <div
        className="flex items-center cursor-pointer p-2 bg-gray-100 rounded"
        onClick={() => toggleSection(sectionKey)}
      >
        {expandedSections[sectionKey] ? <FaChevronDown /> : <FaChevronRight />}
        <span className="ml-2 font-medium">{title}</span>
      </div>
      {expandedSections[sectionKey] && (
        <div className="mt-2 pl-4">
          {content}
        </div>
      )}
    </div>
  );

  // General Section
  const generalContent = (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Text</label>
        <input
          type="text"
          name="content"
          value={component.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter heading text"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Font Family</label>
        <select
          name="fontFamily"
          value={component.props.fontFamily}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {FONT_OPTIONS.map(font => (
            <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {component.props.fontFamily === 'custom' && (
        <div className="mt-2">
          <input
            type="text"
            value={customFont}
            onChange={(e) => {
              setCustomFont(e.target.value);
              handleChange({ target: { name: 'fontFamily', value: e.target.value } });
            }}
            placeholder="Enter custom font name"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFontStyleChange('bold')}
            className={`p-2 rounded ${component.props.fontWeight === 'bold' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <FaBold />
          </button>
          <button
            onClick={() => handleFontStyleChange('italic')}
            className={`p-2 rounded ${component.props.fontStyle === 'italic' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => handleFontStyleChange('underline')}
            className={`p-2 rounded ${component.props.textDecoration?.includes('underline') ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => handleFontStyleChange('overline')}
            className={`p-2 rounded ${component.props.textDecoration?.includes('overline') ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <TbOverline />
          </button>
          <button
            onClick={() => handleFontStyleChange('line-through')}
            className={`p-2 rounded ${component.props.textDecoration?.includes('line-through') ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <TbStrikethrough />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Horizontal Alignment</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStyleChange('textAlign', 'left')}
            className={`p-2 rounded ${component.style.textAlign === 'left' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() => handleStyleChange('textAlign', 'center')}
            className={`p-2 rounded ${component.style.textAlign === 'center' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() => handleStyleChange('textAlign', 'right')}
            className={`p-2 rounded ${component.style.textAlign === 'right' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            <FaAlignRight />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Size</label>
        <select
          value={`${component.props.level}|${component.style.fontSize}`}
          onChange={(e) => {
            const [level, fontSize] = e.target.value.split('|');
            handleHeadingChange(level, fontSize);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="h1|2rem">H1 (2rem)</option>
          <option value="h2|1.5rem">H2 (1.5rem)</option>
          <option value="h3|1.17rem">H3 (1.17rem)</option>
          <option value="h4|1rem">H4 (1rem)</option>
          <option value="h5|0.83rem">H5 (0.83rem)</option>
          <option value="h6|0.67rem">H6 (0.67rem)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <ColorPicker
          color={component.props.color}
          onChange={(color) => handleChange({ target: { name: 'color', value: color } })}
        />
      </div>
    </>
  );

  // Advanced Section
  const advancedContent = (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Line Height</label>
          <button
            onClick={() => handleReset('lineHeight', 1.2)}
            className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
          >
            <FaUndo className="inline mr-1" /> Reset
          </button>
        </div>
        <input
          type="range"
          name="lineHeight"
          min="0.5"
          max="5"
          step="0.1"
          value={component.props.lineHeight || 1.2}
          onChange={(e) => handleChange({ target: { name: 'lineHeight', value: parseFloat(e.target.value) } })}
          className="w-full"
        />
        <span className="text-sm">{component.props.lineHeight || 1.2}</span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Letter Spacing</label>
          <button
            onClick={() => handleReset('letterSpacing', 0)}
            className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
          >
            <FaUndo className="inline mr-1" /> Reset
          </button>
        </div>
        <input
          type="range"
          name="letterSpacing"
          min="-0.5"
          max="2"
          step="0.01"
          value={parseFloat(component.props.letterSpacing) || 0}
          onChange={(e) => handleChange({ target: { name: 'letterSpacing', value: e.target.value + 'em' } })}
          className="w-full"
        />
        <span className="text-sm">{component.props.letterSpacing || '0em'}</span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Word Spacing</label>
          <button
            onClick={() => handleReset('wordSpacing', 0)}
            className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
          >
            <FaUndo className="inline mr-1" /> Reset
          </button>
        </div>
        <input
          type="range"
          name="wordSpacing"
          min="-1"
          max="5"
          step="0.1"
          value={parseFloat(component.props.wordSpacing) || 0}
          onChange={(e) => handleChange({ target: { name: 'wordSpacing', value: e.target.value + 'em' } })}
          className="w-full"
        />
        <span className="text-sm">{component.props.wordSpacing || '0em'}</span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Shadow</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="X"
            className="w-1/4 px-2 py-1 border rounded"
            value={component.props.textShadowX || 0}
            onChange={(e) => handleChange({ target: { name: 'textShadowX', value: e.target.value } })}
          />
          <input
            type="number"
            placeholder="Y"
            className="w-1/4 px-2 py-1 border rounded"
            value={component.props.textShadowY || 0}
            onChange={(e) => handleChange({ target: { name: 'textShadowY', value: e.target.value } })}
          />
          <input
            type="number"
            placeholder="Blur"
            className="w-1/4 px-2 py-1 border rounded"
            value={component.props.textShadowBlur || 0}
            onChange={(e) => handleChange({ target: { name: 'textShadowBlur', value: e.target.value } })}
          />
          <input
            type="color"
            className="w-1/4"
            value={component.props.textShadowColor || '#000000'}
            onChange={(e) => handleChange({ target: { name: 'textShadowColor', value: e.target.value } })}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Hover Effect</label>
        <select
          name="hoverEffect"
          value={component.props.hoverEffect || 'none'}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          name="clickAction"
          value={component.props.clickAction || 'none'}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="none">None</option>
          <option value="smoothScroll">Smooth Scroll</option>
          <option value="openModal">Open Modal</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="heading-controls">
      {renderSection("General", "general", generalContent)}
      {renderSection("Advanced", "advanced", advancedContent)}
      {renderSection("Component", "component", (
        <ComponentControls
          style={component.style}
          onStyleChange={handleStyleChange}
        />
      ))}
    </div>
  );
};

export default HeadingControls;