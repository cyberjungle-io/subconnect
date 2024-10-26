import React, { useState, useCallback } from 'react';
import ColorPicker from '../../common/ColorPicker';
import { FaLink, FaUnlink } from 'react-icons/fa';

const INITIAL_SHADOW_STATE = {
  offset: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  blur: '0px',
  color: '#000000',
  opacity: 0.2
};

const UNITS = ['px', '%', 'em', 'rem', 'vw', 'vh'];

// Button classes
const activeButtonClass = "px-4 py-2 bg-blue-500 text-white rounded-md mr-2";
const inactiveButtonClass = "px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2";

export const ShadowControls = ({ 
  onStyleChange, 
  showInnerShadow, 
  setShowInnerShadow, 
  showOuterShadow, 
  setShowOuterShadow 
}) => {
  return (
    <>
      <button
        onClick={() => setShowInnerShadow(prev => !prev)}
        className={showInnerShadow ? activeButtonClass : inactiveButtonClass}
      >
        Inner Shadow
      </button>
      <button
        onClick={() => setShowOuterShadow(prev => !prev)}
        className={showOuterShadow ? activeButtonClass : inactiveButtonClass}
      >
        Outer Shadow
      </button>
    </>
  );
};

export const ShadowControlsPanel = ({ showInnerShadow, showOuterShadow, onStyleChange }) => {
  const [innerShadowState, setInnerShadowState] = useState(INITIAL_SHADOW_STATE);
  const [outerShadowState, setOuterShadowState] = useState(INITIAL_SHADOW_STATE);
  const [showAllOffsets, setShowAllOffsets] = useState(true);

  const adjustColorOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleShadowChange = useCallback((type, updates) => {
    const newState = type === 'inner' 
      ? { ...innerShadowState, ...updates }
      : { ...outerShadowState, ...updates };

    if (type === 'inner') {
      setInnerShadowState(newState);
    } else {
      setOuterShadowState(newState);
    }

    const createShadowValue = (state, isInner) => {
      const { offset, blur, color, opacity } = state;
      const colorWithOpacity = adjustColorOpacity(color, opacity);
      return isInner 
        ? `inset ${offset.right} ${offset.bottom} ${blur} ${colorWithOpacity}`
        : `${offset.right} ${offset.bottom} ${blur} ${colorWithOpacity}`;
    };

    const innerShadow = showInnerShadow ? createShadowValue(innerShadowState, true) : '';
    const outerShadow = showOuterShadow ? createShadowValue(outerShadowState, false) : '';
    
    const boxShadow = [innerShadow, outerShadow].filter(Boolean).join(', ');
    onStyleChange({ boxShadow });
  }, [showInnerShadow, showOuterShadow, innerShadowState, outerShadowState, onStyleChange]);

  const renderInput = (label, value, onChange, unit = 'px') => (
    <div className="flex">
      <input
        type="number"
        value={parseFloat(value) || 0}
        onChange={(e) => onChange(e.target.value + unit)}
        className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      <select
        value={unit}
        onChange={(e) => onChange(parseFloat(value) + e.target.value)}
        className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        {UNITS.map(u => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
    </div>
  );

  const renderShadowControls = (type, state, setState) => {
    const isInner = type === 'inner';
    
    return (
      <div className="shadow-controls mb-4">
        {/* Update shadow section titles */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isInner ? 'Inner Shadow' : 'Outer Shadow'}
        </h3>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-sm font-medium text-gray-700">Offset</h5>
            <button
              onClick={() => setShowAllOffsets(prev => !prev)}
              className="p-1 rounded-md transition-colors duration-200"
            >
              {showAllOffsets ? 
                <FaLink className="w-3 h-3 text-gray-400" /> : 
                <FaUnlink className="w-3 h-3 text-gray-400" />
              }
            </button>
          </div>
          
          {showAllOffsets ? (
            <div className="grid grid-cols-2 gap-4">
              {renderInput('Horizontal', state.offset.right, (value) => 
                handleShadowChange(type, { offset: { ...state.offset, right: value, left: value } })
              )}
              {renderInput('Vertical', state.offset.bottom, (value) => 
                handleShadowChange(type, { offset: { ...state.offset, top: value, bottom: value } })
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {renderInput('Top', state.offset.top, (value) => 
                handleShadowChange(type, { offset: { ...state.offset, top: value } })
              )}
              {renderInput('Right', state.offset.right, (value) => 
                handleShadowChange(type, { offset: { ...state.offset, right: value } })
              )}
              {renderInput('Bottom', state.offset.bottom, (value) => 
                handleShadowChange(type, { offset: { ...state.offset, bottom: value } })
              )}
              {renderInput('Left', state.offset.left, (value) => 
                handleShadowChange(type, { offset: { ...state.offset, left: value } })
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Blur</label>
          {renderInput('Blur', state.blur, (value) => 
            handleShadowChange(type, { blur: value })
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <ColorPicker
            color={state.color}
            onChange={(color) => handleShadowChange(type, { color })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={state.opacity}
            onChange={(e) => handleShadowChange(type, { opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">{Math.round(state.opacity * 100)}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showInnerShadow && renderShadowControls(
        'inner',
        innerShadowState,
        setInnerShadowState
      )}
      {showOuterShadow && (
        <>
          {showInnerShadow && <div className="border-t border-gray-200" />}
          {renderShadowControls(
            'outer',
            outerShadowState,
            setOuterShadowState
          )}
        </>
      )}
    </div>
  );
};
export default ShadowControls;

