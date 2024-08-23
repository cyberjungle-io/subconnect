import React from 'react';

const LayoutControls = ({ style, onStyleChange }) => {
  const handlePropChange = (name, value) => {
    onStyleChange({ [name]: value });
  };

  const buttonClass = "flex-1 text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2";
  const activeButtonClass = buttonClass + " bg-indigo-100 border-indigo-500";

  const renderButtonControl = (label, name, options) => (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => handlePropChange(name, option.value)}
            className={style[name] === option.value ? activeButtonClass : buttonClass}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="control-section">
      <div className="control-section-content">
        {renderButtonControl("Direction", "flexDirection", [
          { value: "row", label: "Row" },
          { value: "column", label: "Column" }
        ])}
        {renderButtonControl("Wrap", "flexWrap", [
          { value: "nowrap", label: "No Wrap" },
          { value: "wrap", label: "Wrap" },
          { value: "wrap-reverse", label: "Wrap Reverse" }
        ])}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Justify Content</label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {["flex-start", "center", "flex-end"].map(value => (
                <button
                  key={value}
                  onClick={() => handlePropChange("justifyContent", value)}
                  className={style.justifyContent === value ? activeButtonClass : buttonClass}
                >
                  {value === "flex-start" ? "Start" : value === "flex-end" ? "End" : "Center"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {["space-between", "space-around", "space-evenly"].map(value => (
                <button
                  key={value}
                  onClick={() => handlePropChange("justifyContent", value)}
                  className={style.justifyContent === value ? activeButtonClass : buttonClass}
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
      </div>
    </div>
  );
};

export default LayoutControls;