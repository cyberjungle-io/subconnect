import React, { useState, useCallback } from 'react';
import ColorPicker from '../../common/ColorPicker';

const INITIAL_SHADOW_STATE = {
  inner: {
    blur: '4px',
    spread: '0px',
    color: '#000000',
    opacity: 0.2
  },
  outer: {
    bottom: {
      offset: '2px',
      blur: '4px',
      spread: '0px',
      color: '#000000',
      opacity: 0.2,
      enabled: true
    },
    right: {
      offset: '2px',
      blur: '4px',
      spread: '0px',
      color: '#000000',
      opacity: 0.2,
      enabled: true
    }
  }
};

const activeButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-[#cce7ff] text-blue-700 border-blue-300";
const inactiveButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]";

export const ShadowControlsPanel = ({ onStyleChange }) => {
  const [showInnerShadow, setShowInnerShadow] = useState(false);
  const [showOuterShadow, setShowOuterShadow] = useState(false);
  const [innerShadow, setInnerShadow] = useState(INITIAL_SHADOW_STATE.inner);
  const [outerShadow, setOuterShadow] = useState(INITIAL_SHADOW_STATE.outer);

  const handleShadowChange = useCallback(() => {
    const shadows = [];
    
    // Add inner shadow if enabled
    if (showInnerShadow) {
      const { blur, spread, color, opacity } = innerShadow;
      const rgba = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${opacity})`;
      shadows.push(`inset 0 0 ${blur} ${spread} ${rgba}`);
    }
    
    // Add outer shadows if enabled
    if (showOuterShadow) {
      // Bottom shadow
      if (outerShadow.bottom.enabled) {
        const { offset, blur, spread, color, opacity } = outerShadow.bottom;
        const rgba = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${opacity})`;
        shadows.push(`0 ${offset} ${blur} ${spread} ${rgba}`);
      }
      
      // Right shadow
      if (outerShadow.right.enabled) {
        const { offset, blur, spread, color, opacity } = outerShadow.right;
        const rgba = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${opacity})`;
        shadows.push(`${offset} 0 ${blur} ${spread} ${rgba}`);
      }
    }

    onStyleChange({ boxShadow: shadows.join(', ') });
  }, [innerShadow, outerShadow, showInnerShadow, showOuterShadow, onStyleChange]);

  const renderInnerShadowControls = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Inner Shadow</h3>

      {/* Blur Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Blur</label>
        <input
          type="number"
          value={parseFloat(innerShadow.blur)}
          onChange={(e) => {
            setInnerShadow(prev => ({ ...prev, blur: `${e.target.value}px` }));
            handleShadowChange();
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
            setInnerShadow(prev => ({ ...prev, spread: `${e.target.value}px` }));
            handleShadowChange();
          }}
          className="w-full p-2 text-sm border rounded"
        />
      </div>

      {/* Color Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <ColorPicker
          color={innerShadow.color}
          onChange={(color) => {
            setInnerShadow(prev => ({ ...prev, color }));
            handleShadowChange();
          }}
        />
      </div>

      {/* Opacity Control */}
      <div>
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
            setInnerShadow(prev => ({ ...prev, opacity: parseFloat(e.target.value) }));
            handleShadowChange();
          }}
          className="w-full"
        />
      </div>
    </div>
  );

  const renderOuterShadowControls = (side) => {
    const shadow = outerShadow[side];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{side.charAt(0).toUpperCase() + side.slice(1)} Shadow</h3>
          <button
            onClick={() => {
              setOuterShadow(prev => ({
                ...prev,
                [side]: { ...prev[side], enabled: !prev[side].enabled }
              }));
              handleShadowChange();
            }}
            className={shadow.enabled ? activeButtonClass : inactiveButtonClass}
          >
            {shadow.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {shadow.enabled && (
          <>
            {/* Offset Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Offset</label>
              <input
                type="number"
                value={parseFloat(shadow.offset)}
                onChange={(e) => {
                  setOuterShadow(prev => ({
                    ...prev,
                    [side]: { ...prev[side], offset: `${e.target.value}px` }
                  }));
                  handleShadowChange();
                }}
                className="w-full p-2 text-sm border rounded"
              />
            </div>

            {/* Blur Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Blur</label>
              <input
                type="number"
                value={parseFloat(shadow.blur)}
                onChange={(e) => {
                  setOuterShadow(prev => ({
                    ...prev,
                    [side]: { ...prev[side], blur: `${e.target.value}px` }
                  }));
                  handleShadowChange();
                }}
                className="w-full p-2 text-sm border rounded"
              />
            </div>

            {/* Spread Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Spread</label>
              <input
                type="number"
                value={parseFloat(shadow.spread)}
                onChange={(e) => {
                  setOuterShadow(prev => ({
                    ...prev,
                    [side]: { ...prev[side], spread: `${e.target.value}px` }
                  }));
                  handleShadowChange();
                }}
                className="w-full p-2 text-sm border rounded"
              />
            </div>

            {/* Color Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <ColorPicker
                color={shadow.color}
                onChange={(color) => {
                  setOuterShadow(prev => ({
                    ...prev,
                    [side]: { ...prev[side], color }
                  }));
                  handleShadowChange();
                }}
              />
            </div>

            {/* Opacity Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opacity: {Math.round(shadow.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={shadow.opacity}
                onChange={(e) => {
                  setOuterShadow(prev => ({
                    ...prev,
                    [side]: { ...prev[side], opacity: parseFloat(e.target.value) }
                  }));
                  handleShadowChange();
                }}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setShowInnerShadow(!showInnerShadow)}
          className={showInnerShadow ? activeButtonClass : inactiveButtonClass}
        >
          Inner Shadow
        </button>
        <button
          onClick={() => setShowOuterShadow(!showOuterShadow)}
          className={showOuterShadow ? activeButtonClass : inactiveButtonClass}
        >
          Outer Shadow
        </button>
      </div>

      {showInnerShadow && (
        <div className="mt-4">
          {renderInnerShadowControls()}
        </div>
      )}

      {showOuterShadow && (
        <div className="mt-4 pt-4 border-t">
          {renderOuterShadowControls('bottom')}
          {renderOuterShadowControls('right')}
        </div>
      )}
    </div>
  );
};

export default ShadowControlsPanel;
