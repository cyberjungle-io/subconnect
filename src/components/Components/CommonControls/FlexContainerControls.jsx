import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ComponentControls from './ComponentControls';

const FlexContainerControls = ({ component, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePropChange = (e) => {
    const { name, value } = e.target;
    onUpdate({
      props: { ...component.props, [name]: value },
    });
  };

  const selectClass = "w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1";

  const buttonClass = "flex-1 text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2";
  const activeButtonClass = buttonClass + " bg-indigo-100 border-indigo-500";

  const renderButtonControl = (label, name, options) => (
    <div className="mb-2">
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => handlePropChange({ target: { name, value: option.value } })}
            className={component.props[name] === option.value ? activeButtonClass : buttonClass}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const [gapValue, setGapValue] = useState('0');
  const [gapUnit, setGapUnit] = useState('px');

  useEffect(() => {
    if (component.props.gap) {
      const match = component.props.gap.match(/^(\d+)(px|rem|em|%)$/);
      if (match) {
        setGapValue(match[1]);
        setGapUnit(match[2]);
      }
    }
  }, [component.props.gap]);

  const handleGapChange = () => {
    const newGap = gapValue === '0' ? '0' : `${gapValue}${gapUnit}`;
    handlePropChange({ target: { name: 'gap', value: newGap } });
  };

  return (
    <div className="control-section">
      <div className="control-section-header" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        <span className="control-section-title">Flex Container</span>
      </div>
      {isExpanded && (
        <div className="control-section-content">
          {renderButtonControl("Direction", "direction", [
            { value: "row", label: "Row" },
            { value: "column", label: "Column" }
          ])}
          {renderButtonControl("Wrap", "wrap", [
            { value: "nowrap", label: "No Wrap" },
            { value: "wrap", label: "Wrap" },
            { value: "wrap-reverse", label: "Wrap Reverse" }
          ])}
          <div className="mb-2">
            <label className={labelClass}>Justify Content</label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {["flex-start", "center", "flex-end"].map(value => (
                  <button
                    key={value}
                    onClick={() => handlePropChange({ target: { name: "justifyContent", value } })}
                    className={component.props.justifyContent === value ? activeButtonClass : buttonClass}
                  >
                    {value === "flex-start" ? "Start" : value === "flex-end" ? "End" : "Center"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {["space-between", "space-around", "space-evenly"].map(value => (
                  <button
                    key={value}
                    onClick={() => handlePropChange({ target: { name: "justifyContent", value } })}
                    className={component.props.justifyContent === value ? activeButtonClass : buttonClass}
                  >
                    {value.split('-')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {renderButtonControl("Align Items", "alignItems", [
            { value: "stretch", label: "Stretch" },
            { value: "flex-start", label: "Start" },
            { value: "center", label: "Center" },
            { value: "flex-end", label: "End" },
            { value: "baseline", label: "Baseline" }
          ])}
          {renderButtonControl("Align Content", "alignContent", [
            { value: "stretch", label: "Stretch" },
            { value: "flex-start", label: "Start" },
            { value: "center", label: "Center" },
            { value: "flex-end", label: "End" },
            { value: "space-between", label: "Between" },
            { value: "space-around", label: "Around" }
          ])}
          <div className="mb-2">
            <label className={labelClass}>Gap</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={gapValue}
                onChange={(e) => {
                  setGapValue(e.target.value);
                  handleGapChange();
                }}
                className="flex-1 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                value={gapUnit}
                onChange={(e) => {
                  setGapUnit(e.target.value);
                  handleGapChange();
                }}
                className="text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          {/* Add ComponentControls */}
          <ComponentControls
            style={component.style}
            onStyleChange={(updates) => onUpdate({ style: { ...component.style, ...updates } })}
            componentId={component.id}
          />
        </div>
      )}
    </div>
  );
};

export default FlexContainerControls;