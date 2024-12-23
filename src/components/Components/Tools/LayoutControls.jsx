import React from "react";
import {
  FaArrowsAltH,
  FaArrowsAltV,
  FaExchangeAlt,
  FaBan,
  FaUndoAlt,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaGripLines,
  FaGripLinesVertical,
  FaExpandAlt,
  FaArrowsAlt,
  FaGripHorizontal,
  FaEquals,
  FaRulerHorizontal,
} from "react-icons/fa";

const LayoutControls = ({ style, props, onStyleChange }) => {
  const handlePropChange = (name, value) => {
    // For direction, update flexDirection directly
    if (name === "flexDirection") {
      console.log("LayoutControls: Updating flexDirection", {
        oldValue: value,
        newProps: { flexDirection: value },
      });
      onStyleChange({
        style: {
          flexDirection: value,
        },
      });
      return;
    }

    // For other layout properties, update directly
    if (
      ["flexWrap", "alignItems", "justifyContent", "alignContent"].includes(
        name
      )
    ) {
      console.log("LayoutControls: Updating layout prop", {
        name,
        value,
      });
      onStyleChange({
        style: {
          [name]: value,
        },
      });
      return;
    }

    // For any other properties, update style
    console.log("LayoutControls: Updating style", {
      name,
      value,
      newStyle: { [name]: value },
    });
    onStyleChange({ style: { [name]: value } });
  };

  // Helper function to get current value from either style or props
  const getCurrentValue = (name) => {
    return props?.[name] || style?.[name];
  };

  const buttonClass =
    "px-2 py-1 text-xs rounded-full transition-colors duration-200 border text-center min-w-[80px] whitespace-nowrap";
  const activeButtonClass = `${buttonClass} bg-[#cce7ff] text-blue-700 border-blue-300`;
  const inactiveButtonClass = `${buttonClass} bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]`;

  const renderButtonControl = (label, name, options, customLayout = false) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      {customLayout ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {options.slice(0, 3).map((option) => (
              <button
                key={option.value}
                onClick={() => handlePropChange(name, option.value)}
                className={`${
                  getCurrentValue(name) === option.value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1 flex items-center justify-center gap-1`}
              >
                {option.icon && <option.icon className="w-3 h-3" />}
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {options.slice(3).map((option) => (
              <button
                key={option.value}
                onClick={() => handlePropChange(name, option.value)}
                className={`${
                  getCurrentValue(name) === option.value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1 flex items-center justify-center gap-1`}
              >
                {option.icon && <option.icon className="w-3 h-3" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePropChange(name, option.value)}
              className={`${
                getCurrentValue(name) === option.value
                  ? activeButtonClass
                  : inactiveButtonClass
              } flex-1 flex items-center justify-center gap-1`}
            >
              {option.icon && <option.icon className="w-3 h-3" />}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Layout Controls
      </h3>
      <div className="control-section-content">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Direction</h4>
          <div className="flex gap-2">
            {[
              { value: "row", label: "Horizontal", icon: FaArrowsAltH },
              { value: "column", label: "Vertical", icon: FaArrowsAltV },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handlePropChange("flexDirection", value)}
                className={`${
                  getCurrentValue("flexDirection") === value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1 flex items-center justify-center gap-1`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Wrap</h4>
          <div className="flex gap-2">
            {[
              { value: "nowrap", label: "No Wrap", icon: FaBan },
              { value: "wrap", label: "Wrap", icon: FaExchangeAlt },
              { value: "wrap-reverse", label: "Reverse", icon: FaUndoAlt },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handlePropChange("flexWrap", value)}
                className={`${
                  getCurrentValue("flexWrap") === value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1 flex items-center justify-center gap-1`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {renderButtonControl(
          "Justify Content",
          "justifyContent",
          [
            { value: "flex-start", label: "Start", icon: FaAlignLeft },
            { value: "center", label: "Center", icon: FaAlignCenter },
            { value: "flex-end", label: "End", icon: FaAlignRight },
            {
              value: "space-between",
              label: "Between",
              icon: FaGripHorizontal,
            },
            { value: "space-around", label: "Around", icon: FaArrowsAlt },
            { value: "space-evenly", label: "Evenly", icon: FaEquals },
          ],
          true
        )}

        {renderButtonControl(
          "Align Items",
          "alignItems",
          [
            { value: "flex-start", label: "Start", icon: FaAlignLeft },
            { value: "center", label: "Center", icon: FaAlignCenter },
            { value: "flex-end", label: "End", icon: FaAlignRight },
            { value: "stretch", label: "Stretch", icon: FaExpandAlt },
            { value: "baseline", label: "Baseline", icon: FaRulerHorizontal },
          ],
          true
        )}

        {renderButtonControl(
          "Align Content",
          "alignContent",
          [
            { value: "flex-start", label: "Start", icon: FaAlignLeft },
            { value: "center", label: "Center", icon: FaAlignCenter },
            { value: "flex-end", label: "End", icon: FaAlignRight },
            { value: "stretch", label: "Stretch", icon: FaExpandAlt },
            {
              value: "space-between",
              label: "Between",
              icon: FaGripHorizontal,
            },
            { value: "space-around", label: "Around", icon: FaArrowsAlt },
          ],
          true
        )}
      </div>
    </div>
  );
};

export default LayoutControls;
