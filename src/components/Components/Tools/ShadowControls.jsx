import React, { useState, useCallback } from 'react';
import ColorPicker from '../../common/ColorPicker';

const SHADOW_PRESETS = {
  subtle: {
    x: '0px',
    y: '2px',
    blur: '4px',
    spread: '0px',
    color: '#000000',
    opacity: 0.15,
    description: 'A light, small shadow'
  },
  medium: {
    x: '0px',
    y: '4px',
    blur: '8px',
    spread: '0px',
    color: '#000000',
    opacity: 0.2,
    description: 'A balanced, medium-sized shadow'
  },
  harsh: {
    x: '4px',
    y: '4px',
    blur: '8px',
    spread: '0px',
    color: '#000000',
    opacity: 0.25,
    description: 'A stronger, more visible shadow'
  },
  floating: {
    x: '0px',
    y: '8px',
    blur: '16px',
    spread: '-2px',
    color: '#000000',
    opacity: 0.25,
    description: 'An elevated effect with negative spread'
  },
  layered: {
    x: '0px',
    y: '2px',
    blur: '4px',
    spread: '0px',
    color: '#000000',
    opacity: 0.2,
    description: 'A subtle, close shadow good for cards'
  }
};

const INNER_SHADOW_PRESETS = {
  subtle: {
    blur: '4px',
    spread: '0px',
    color: '#000000',
    opacity: 0.15,
    description: 'A light inner shadow'
  },
  medium: {
    blur: '10px',
    spread: '3px',
    color: '#000000',
    opacity: 0.25,
    description: 'A balanced inner shadow'
  },
  deep: {
    blur: '16px',
    spread: '6px',
    color: '#000000',
    opacity: 0.3,
    description: 'A pronounced inner shadow'
  },
  pressed: {
    blur: '2px',
    spread: '1px',
    color: '#000000',
    opacity: 0.3,
    description: 'A tight inner shadow for pressed states'
  },
  hollow: {
    blur: '16px',
    spread: '8px',
    color: '#000000',
    opacity: 0.15,
    description: 'A soft, spread-out inner shadow'
  }
};

const INITIAL_SHADOW_STATE = {
  inner: {
    ...INNER_SHADOW_PRESETS.subtle
  },
  outer: {
    ...SHADOW_PRESETS.subtle
  }
};

const activeButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-[#cce7ff] text-blue-700 border-blue-300";
const inactiveButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]";

export const ShadowControlsPanel = ({ onStyleChange, showInnerShadow, showOuterShadow }) => {
  const [innerShadow, setInnerShadow] = useState(INITIAL_SHADOW_STATE.inner);
  const [outerShadow, setOuterShadow] = useState(INITIAL_SHADOW_STATE.outer);
  const [activePreset, setActivePreset] = useState('subtle');
  const [activeInnerPreset, setActiveInnerPreset] = useState('subtle');

  const handleShadowChange = useCallback(() => {
    const shadows = [];
    
    // Add inner shadow if enabled
    if (showInnerShadow) {
      const { blur, spread, color, opacity } = innerShadow;
      let rgba;
      
      // Handle both hex and rgba color formats
      if (color.startsWith('rgba')) {
        rgba = color; // Already in rgba format
      } else {
        // Convert hex to rgba
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16);
        const b = parseInt(color.slice(5,7), 16);
        rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      
      shadows.push(`inset 0 0 ${blur} ${spread} ${rgba}`);
    }
    
    // Handle outer shadow
    const { color, opacity, blur, spread, x, y } = outerShadow;
    let rgba;
    
    if (color.startsWith('rgba')) {
      rgba = color;
    } else {
      const r = parseInt(color.slice(1,3), 16);
      const g = parseInt(color.slice(3,5), 16);
      const b = parseInt(color.slice(5,7), 16);
      rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Main shadow with X and Y offsets
    if (parseFloat(x) !== 0 || parseFloat(y) !== 0) {
      shadows.push(`${x} ${y} ${blur} ${spread} ${rgba}`);
    }

    onStyleChange({ boxShadow: shadows.join(', ') });
  }, [innerShadow, outerShadow, showInnerShadow, onStyleChange]);

  const applyPreset = (presetName) => {
    setOuterShadow(prev => ({
      ...prev,
      ...SHADOW_PRESETS[presetName]
    }));
    setActivePreset(presetName);
    setTimeout(handleShadowChange, 0);
  };

  const handleManualChange = (updates) => {
    setOuterShadow(prev => ({ ...prev, ...updates }));
    setActivePreset(null);
    handleShadowChange();
  };

  const applyInnerPreset = (presetName) => {
    setInnerShadow(prev => ({
      ...prev,
      ...INNER_SHADOW_PRESETS[presetName]
    }));
    setActiveInnerPreset(presetName);
    setTimeout(handleShadowChange, 0);
  };

  const handleManualInnerChange = (updates) => {
    setInnerShadow(prev => ({ ...prev, ...updates }));
    setActiveInnerPreset(null);
    handleShadowChange();
  };

  const renderInnerShadowControls = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Inner Shadow</h3>

      {/* Add Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(INNER_SHADOW_PRESETS).map(([presetName, preset]) => (
            <button
              key={presetName}
              onClick={() => applyInnerPreset(presetName)}
              title={preset.description}
              className={presetName === activeInnerPreset ? activeButtonClass : inactiveButtonClass}
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      {/* Blur Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Blur</label>
        <input
          type="number"
          value={parseFloat(innerShadow.blur)}
          onChange={(e) => {
            handleManualInnerChange({ blur: `${e.target.value}px` });
          }}
          className="w-full p-2 text-sm border rounded"
        />
      </div>

      {/* Spread Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Spread</label>
        <input
          type="number"
          value={parseFloat(innerShadow.spread)}
          onChange={(e) => {
            handleManualInnerChange({ spread: `${e.target.value}px` });
          }}
          className="w-full p-2 text-sm border rounded"
        />
      </div>

      {/* Color and Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="flex space-x-4">
          <div className="flex-grow">
            <ColorPicker
              color={innerShadow.color}
              onChange={(newColor) => {
                if (newColor.startsWith('rgba')) {
                  const rgba = newColor.match(/\d+/g);
                  if (rgba && rgba.length >= 3) {
                    const hex = '#' + rgba.slice(0, 3)
                      .map(x => parseInt(x).toString(16).padStart(2, '0'))
                      .join('');
                    handleManualInnerChange({ color: hex });
                  }
                } else {
                  handleManualInnerChange({ color: newColor });
                }
              }}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700">
              Opacity: {Math.round(innerShadow.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={innerShadow.opacity}
              onChange={(e) => {
                handleManualInnerChange({ opacity: parseFloat(e.target.value) });
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderOuterShadowControls = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Outer Shadow</h3>

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SHADOW_PRESETS).map(([presetName, preset]) => (
            <button
              key={presetName}
              onClick={() => applyPreset(presetName)}
              title={preset.description}
              className={presetName === activePreset ? activeButtonClass : inactiveButtonClass}
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      {/* Position Controls */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600">X Offset</label>
            <input
              type="number"
              value={parseFloat(outerShadow.x)}
              onChange={(e) => {
                handleManualChange({ x: `${e.target.value}px` });
              }}
              className="w-full p-2 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Y Offset</label>
            <input
              type="number"
              value={parseFloat(outerShadow.y)}
              onChange={(e) => {
                handleManualChange({ y: `${e.target.value}px` });
              }}
              className="w-full p-2 text-sm border rounded"
            />
          </div>
        </div>
      </div>

      {/* Blur and Spread */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Blur</label>
          <input
            type="number"
            value={parseFloat(outerShadow.blur)}
            onChange={(e) => {
              handleManualChange({ blur: `${e.target.value}px` });
            }}
            className="w-full p-2 text-sm border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Spread</label>
          <input
            type="number"
            value={parseFloat(outerShadow.spread)}
            onChange={(e) => {
              handleManualChange({ spread: `${e.target.value}px` });
            }}
            className="w-full p-2 text-sm border rounded"
          />
        </div>
      </div>

      {/* Color and Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="flex space-x-4">
          <div className="flex-grow">
            <ColorPicker
              color={outerShadow.color}
              onChange={(newColor) => {
                // If the new color is in rgba format, extract just the hex
                if (newColor.startsWith('rgba')) {
                  // Extract the RGB values
                  const rgba = newColor.match(/\d+/g);
                  if (rgba && rgba.length >= 3) {
                    // Convert RGB to hex
                    const hex = '#' + rgba.slice(0, 3)
                      .map(x => parseInt(x).toString(16).padStart(2, '0'))
                      .join('');
                    handleManualChange({ color: hex });
                  }
                } else {
                  // It's already a hex color
                  handleManualChange({ color: newColor });
                }
              }}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700">
              Opacity: {Math.round(outerShadow.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={outerShadow.opacity}
              onChange={(e) => {
                handleManualChange({ opacity: parseFloat(e.target.value) });
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {showInnerShadow && (
        <div>
          {renderInnerShadowControls()}
        </div>
      )}

      {showOuterShadow && (
        <div>
          {renderOuterShadowControls()}
        </div>
      )}
    </div>
  );
};

export default ShadowControlsPanel;
