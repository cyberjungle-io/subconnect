import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';

const ComponentControls = ({ style, onStyleChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onStyleChange({ [name]: value });
  };

  const handleColorChange = (color, property) => {
    onStyleChange({ [property]: color });
  };

  return (
    <div className="control-section">
      <div className="control-section-header" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        <span className="control-section-title">Component Controls</span>
      </div>
      {isExpanded && (
        <div className="control-section-content">
          <div className="mb-2">
            <label className="control-label">Background Color</label>
            <ColorPicker
              color={style.backgroundColor || '#ffffff'}
              onChange={(color) => handleColorChange(color, 'backgroundColor')}
            />
          </div>

          <div className="mb-2">
            <label className="control-label">
              <input
                type="checkbox"
                checked={style.showBorder !== false}
                onChange={(e) => onStyleChange({ showBorder: e.target.checked })}
                className="mr-2"
              />
              Show Border
            </label>
          </div>

          {style.showBorder !== false && (
            <>
              <div className="mb-2">
                <label className="control-label">Border Color</label>
                <ColorPicker
                  color={style.borderColor || '#000000'}
                  onChange={(color) => onStyleChange({ borderColor: color })}
                />
              </div>

              <div className="mb-2">
                <label className="control-label">Border Style</label>
                <select
                  name="borderStyle"
                  value={style.borderStyle || 'solid'}
                  onChange={(e) => onStyleChange({ borderStyle: e.target.value })}
                  className="control-select"
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </>
          )}

          <div className="mb-2">
            <label className="control-label">Border Width (px)</label>
            <input
              type="number"
              name="borderWidth"
              value={parseInt(style.borderWidth) || 0}
              onChange={(e) => onStyleChange({ borderWidth: `${e.target.value}px` })}
              className="control-input"
            />
          </div>

          <div className="mb-2">
            <label className="control-label">Border Radius (px)</label>
            <input
              type="number"
              name="borderRadius"
              value={parseInt(style.borderRadius) || 0}
              onChange={(e) => onStyleChange({ borderRadius: `${e.target.value}px` })}
              className="control-input"
            />
          </div>

          <div className="mb-2">
            <label className="control-label">Box Shadow</label>
            <input
              type="text"
              name="boxShadow"
              value={style.boxShadow || ''}
              onChange={handleChange}
              placeholder="e.g., 2px 2px 4px #000000"
              className="control-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentControls;