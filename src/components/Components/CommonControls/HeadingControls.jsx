import React from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';


const HeadingControls = ({ component, onUpdate }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
    typography: false,
    layout: false,
    advanced: false,
    responsive: false
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

  return (
    <div className="heading-controls">
      {renderSection("Basic Settings", "basic", (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Heading Level</label>
            <select
              name="level"
              value={component.props.level}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
                <option key={level} value={level}>{level.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <input
              type="text"
              name="content"
              value={component.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      ))}

      {renderSection("Typography", "typography", (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Font Family</label>
            <select
              name="fontFamily"
              value={component.props.fontFamily}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {['Arial, sans-serif', 'Helvetica, sans-serif', 'Times New Roman, serif', 'Courier New, monospace'].map(font => (
                <option key={font} value={font}>{font.split(',')[0]}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Font Size</label>
            <input
              type="text"
              name="fontSize"
              value={component.props.fontSize}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Font Weight</label>
            <select
              name="fontWeight"
              value={component.props.fontWeight}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Font Style</label>
            <select
              name="fontStyle"
              value={component.props.fontStyle}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Text Decoration</label>
            <select
              name="textDecoration"
              value={component.props.textDecoration}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="overline">Overline</option>
              <option value="line-through">Line-through</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Text Transform</label>
            <select
              name="textTransform"
              value={component.props.textTransform}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <ColorPicker
              color={component.props.color}
              onChange={(color) => handleChange({ target: { name: 'color', value: color } })}
            />
          </div>
        </>
      ))}

{renderSection("Layout", "layout", (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Text Align</label>
            <select
              name="textAlign"
              value={component.props.textAlign}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Vertical Align</label>
            <select
              name="verticalAlign"
              value={component.props.verticalAlign}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <input
              type="text"
              name="width"
              value={component.style.width || component.props.width}
              onChange={(e) => onUpdate({ style: { ...component.style, width: e.target.value } })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <input
              type="text"
              name="height"
              value={component.style.height || component.props.height}
              onChange={(e) => onUpdate({ style: { ...component.style, height: e.target.value } })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      ))}

      {renderSection("Advanced", "advanced", (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Line Height</label>
            <input
              type="text"
              name="lineHeight"
              value={component.props.lineHeight}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Letter Spacing</label>
            <input
              type="text"
              name="letterSpacing"
              value={component.props.letterSpacing}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Word Spacing</label>
            <input
              type="text"
              name="wordSpacing"
              value={component.props.wordSpacing}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Text Shadow</label>
            <input
              type="text"
              name="textShadow"
              value={component.props.textShadow}
              onChange={handleChange}
              placeholder="e.g., 2px 2px 2px #000000"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <ColorPicker
              color={component.props.backgroundColor}
              onChange={(color) => handleChange({ target: { name: 'backgroundColor', value: color } })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Hover Effect</label>
            <select
              name="hoverEffect"
              value={component.props.hoverEffect}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="color">Color Change</option>
              <option value="scale">Scale</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Click Action</label>
            <select
              name="clickAction"
              value={component.props.clickAction}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="smoothScroll">Smooth Scroll</option>
              <option value="openModal">Open Modal</option>
            </select>
          </div>
        </>
      ))}

      {renderSection("Responsive", "responsive", (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Hide on Mobile</label>
            <input
              type="checkbox"
              name="responsiveHide.mobile"
              checked={component.props.responsiveHide.mobile}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Hide on Tablet</label>
            <input
              type="checkbox"
              name="responsiveHide.tablet"
              checked={component.props.responsiveHide.tablet}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Hide on Desktop</label>
            <input
              type="checkbox"
              name="responsiveHide.desktop"
              checked={component.props.responsiveHide.desktop}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Mobile Font Size</label>
            <input
              type="text"
              name="responsiveFontSize.mobile"
              value={component.props.responsiveFontSize.mobile}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Tablet Font Size</label>
            <input
              type="text"
              name="responsiveFontSize.tablet"
              value={component.props.responsiveFontSize.tablet}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Desktop Font Size</label>
            <input
              type="text"
              name="responsiveFontSize.desktop"
              value={component.props.responsiveFontSize.desktop}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      ))}
    </div>
  );
};

export default HeadingControls;