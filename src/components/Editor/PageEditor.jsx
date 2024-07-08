import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updatePageSettings, 
  updateTypography, 
  updateHeadingStyle, 
  updateScrollbarSettings 
} from '../../features/editorSlice';
import ColorPicker from '../common/ColorPicker';
import { FaChevronDown, FaFont, FaPalette, FaScroll, FaEye, FaEyeSlash } from 'react-icons/fa';



import PreviewModal from '../common/PreviewModal';

const fontFamilies = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace',
];

const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

const PageEditor = () => {
    const dispatch = useDispatch();
    const pageSettings = useSelector(state => state.editor.pageSettings);
    const [activeSection, setActiveSection] = useState('typography');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
  

  const handleColorChange = (color) => {
    dispatch(updatePageSettings({ backgroundColor: color }));
  };

  const handleScrollDirectionChange = (direction) => {
    dispatch(updatePageSettings({ scrollDirection: direction }));
  };

  const handleFontFamilyChange = (event) => {
    dispatch(updateTypography({ fontFamily: event.target.value }));
  };

  const handleBaseFontSizeChange = (event) => {
    dispatch(updateTypography({ fontSize: event.target.value }));
  };

  const handleLineHeightChange = (event) => {
    dispatch(updateTypography({ lineHeight: event.target.value }));
  };

  const handleHeadingStyleChange = (headingType, property, value) => {
    dispatch(updateHeadingStyle({ headingType, style: { [property]: value } }));
  };

  const handleScrollbarSettingChange = (setting, value) => {
    dispatch(updateScrollbarSettings({ [setting]: value }));
  };
  const handleNumberInput = (setting, value, min, max) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      dispatch(updateTypography({ [setting]: `${numValue}px` }));
    }
  };

  const renderNumberInput = (label, value, onChange, min, max, step = 1) => (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex items-center">
        <input
          type="number"
          value={parseFloat(value)}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          className="w-20 px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-col">
          <button 
            onClick={() => onChange(Math.min(parseFloat(value) + step, max))}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-tr-md"
          >
            ▲
          </button>
          <button 
            onClick={() => onChange(Math.max(parseFloat(value) - step, min))}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-br-md"
          >
            ▼
          </button>
        </div>
        <span className="ml-2 text-sm text-gray-500">px</span>
      </div>
    </div>
  );

  const renderTypographySection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Typography</h2>
        <button
          onClick={() => setShowPreviewModal(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm"
        >
          <FaEye className="mr-2" />
          Preview
        </button>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Font Family</label>
        <select
          value={pageSettings.typography.fontFamily}
          onChange={(e) => dispatch(updateTypography({ fontFamily: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>{font.split(',')[0]}</option>
          ))}
        </select>
      </div>
      {renderNumberInput(
        "Base Font Size",
        pageSettings.typography.fontSize,
        (value) => dispatch(updateTypography({ fontSize: `${value}px` })),
        8,
        32
      )}
      {renderNumberInput(
        "Line Height",
        pageSettings.typography.lineHeight,
        (value) => dispatch(updateTypography({ lineHeight: value })),
        1,
        3,
        0.1
      )}
      {headingTypes.map((headingType) => (
        <div key={headingType} className="space-y-2">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{headingType.toUpperCase()} Style</label>
          <div className="flex items-center space-x-2">
            {renderNumberInput(
              "",
              pageSettings.typography[headingType].fontSize,
              (value) => dispatch(updateHeadingStyle({ headingType, style: { fontSize: `${value}px` } })),
              8,
              72
            )}
            <select
              value={pageSettings.typography[headingType].fontWeight}
              onChange={(e) => dispatch(updateHeadingStyle({ headingType, style: { fontWeight: e.target.value } }))}
              className="w-1/3 px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
            <ColorPicker
              currentColor={pageSettings.typography[headingType].color}
              onColorSelect={(color) => dispatch(updateHeadingStyle({ headingType, style: { color } }))}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderColorSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Background Color</label>
        <ColorPicker
          currentColor={pageSettings.backgroundColor}
          onColorSelect={handleColorChange}
        />
      </div>
    </div>
  );

  const renderScrollSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Scroll Direction</label>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              pageSettings.scrollDirection === 'vertical'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleScrollDirectionChange('vertical')}
          >
            Vertical
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              pageSettings.scrollDirection === 'horizontal'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleScrollDirectionChange('horizontal')}
          >
            Horizontal
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="custom-scrollbar"
          checked={!pageSettings.scrollbar.useDefault}
          onChange={(e) => handleScrollbarSettingChange('useDefault', !e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="custom-scrollbar" className="text-sm text-gray-700">Use Custom Scrollbar</label>
      </div>
      {!pageSettings.scrollbar.useDefault && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Scrollbar Width</label>
            <input
              type="text"
              value={pageSettings.scrollbar.width}
              onChange={(e) => handleScrollbarSettingChange('width', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Track Color</label>
            <ColorPicker
              currentColor={pageSettings.scrollbar.trackColor}
              onColorSelect={(color) => handleScrollbarSettingChange('trackColor', color)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Thumb Color</label>
            <ColorPicker
              currentColor={pageSettings.scrollbar.thumbColor}
              onColorSelect={(color) => handleScrollbarSettingChange('thumbColor', color)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Thumb Hover Color</label>
            <ColorPicker
              currentColor={pageSettings.scrollbar.thumbHoverColor}
              onColorSelect={(color) => handleScrollbarSettingChange('thumbHoverColor', color)}
            />
          </div>
        </div>
      )}
    </div>
  );


  return (
    <div className="h-screen flex flex-col bg-white border-l border-gray-200">
      <div className="flex border-b border-gray-200">
        {['typography', 'colors', 'scroll'].map((section) => (
          <button
            key={section}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === section
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section === 'typography' && <FaFont className="inline-block mr-2" />}
            {section === 'colors' && <FaPalette className="inline-block mr-2" />}
            {section === 'scroll' && <FaScroll className="inline-block mr-2" />}
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          {activeSection === 'typography' && renderTypographySection()}
          {activeSection === 'colors' && renderColorSection()}
          {activeSection === 'scroll' && renderScrollSection()}
        </div>
      </div>
      {showPreviewModal && (
        <PreviewModal onClose={() => setShowPreviewModal(false)} />
      )}
    </div>
  );
};

export default PageEditor;