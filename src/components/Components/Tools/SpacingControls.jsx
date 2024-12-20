import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

const PADDING_PRESETS = {
  Small: "8px",
  Medium: "16px",
  Large: "24px",
};

const MARGIN_PRESETS = {
  Small: "8px",
  Medium: "16px",
  Large: "24px",
};

const UNITS = ["px", "em", "rem", "%", "vw", "vh"];

const SpacingControls = ({ style, onStyleChange, component }) => {
  const [paddingTop, setPaddingTop] = useState("0px");
  const [paddingRight, setPaddingRight] = useState("0px");
  const [paddingBottom, setPaddingBottom] = useState("0px");
  const [paddingLeft, setPaddingLeft] = useState("0px");
  const [marginTop, setMarginTop] = useState("0px");
  const [marginRight, setMarginRight] = useState("0px");
  const [marginBottom, setMarginBottom] = useState("0px");
  const [marginLeft, setMarginLeft] = useState("0px");
  const [gap, setGap] = useState("0px");
  const [selectedPaddingPreset, setSelectedPaddingPreset] = useState(null);
  const [selectedMarginPreset, setSelectedMarginPreset] = useState(null);

  const debouncedStyleChange = useCallback(
    debounce((newStyle) => {
      onStyleChange(newStyle);
    }, 300),
    [onStyleChange]
  );

  const handleChange = useCallback((property, value) => {
    const updateSpacing = (top, right, bottom, left) =>
      `${top} ${right} ${bottom} ${left}`;

    let newStyle;
    if (property.startsWith("padding")) {
      newStyle = {
        padding: updateSpacing(
          property === "paddingTop" ? value : paddingTop,
          property === "paddingRight" ? value : paddingRight,
          property === "paddingBottom" ? value : paddingBottom,
          property === "paddingLeft" ? value : paddingLeft
        ),
      };
      setSelectedPaddingPreset(null);
    } else if (property.startsWith("margin")) {
      newStyle = {
        margin: updateSpacing(
          property === "marginTop" ? value : marginTop,
          property === "marginRight" ? value : marginRight,
          property === "marginBottom" ? value : marginBottom,
          property === "marginLeft" ? value : marginLeft
        ),
      };
      setSelectedMarginPreset(null);
    } else {
      newStyle = { [property]: value };
    }
    debouncedStyleChange(newStyle);
  }, [debouncedStyleChange, paddingTop, paddingRight, paddingBottom, paddingLeft, marginTop, marginRight, marginBottom, marginLeft]);

  const throttledHandleChange = useCallback(
    throttle((property, value) => {
      handleChange(property, value);
    }, 100),
    [handleChange]
  );

  useEffect(() => {
    if (style) {
      const parseSpacing = (value) => (value || "0px 0px 0px 0px").split(" ");
      const [pTop, pRight, pBottom, pLeft] = parseSpacing(style.padding);
      const [mTop, mRight, mBottom, mLeft] = parseSpacing(style.margin);

      setPaddingTop(pTop);
      setPaddingRight(pRight || pTop);
      setPaddingBottom(pBottom || pTop);
      setPaddingLeft(pLeft || pRight || pTop);

      setMarginTop(mTop);
      setMarginRight(mRight || mTop);
      setMarginBottom(mBottom || mTop);
      setMarginLeft(mLeft || mRight || mTop);

      setGap(style.gap || "0px");
    }
  }, [style]);

  const applyPreset =
    (presets, setters, property, selectedPreset, setSelectedPreset) =>
    (presetName) => {
      const preset = presets[presetName];
      const isDeselecting = selectedPreset === presetName;

      setters.forEach((setter) => setter(isDeselecting ? "0px" : preset));
      
      const styleUpdate = {
        [property]: isDeselecting ? "0px" : preset,
        top: 0,
        left: 0
      };
      
      onStyleChange(styleUpdate);
      
      if (component?.props?.style) {
        onStyleChange({
          props: {
            ...component.props,
            style: {
              ...component.props.style,
              top: 0,
              left: 0
            }
          }
        });
      }
      
      setSelectedPreset(isDeselecting ? null : presetName);
    };

  const renderInputGroup = (label, values, setters, properties) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-4 gap-x-0 gap-y-1 w-42 mx-auto">
        <div className="col-start-2 col-span-2">
          {renderInput("Top", values[0], setters[0], properties[0])}
        </div>
        <div className="col-start-1 col-span-2 row-start-2 justify-self-end pr-2">
          {renderInput("Left", values[3], setters[3], properties[3])}
        </div>
        <div className="col-start-3 col-span-2 row-start-2 justify-self-start pl-2">
          {renderInput("Right", values[1], setters[1], properties[1])}
        </div>
        <div className="col-start-2 col-span-2 row-start-3">
          {renderInput("Bottom", values[2], setters[2], properties[2])}
        </div>
      </div>
    </div>
  );

  const renderInput = (side, value, setter, property) => (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1">{side}</span>
      <div className="flex">
        <input
          type="text"
          value={value.replace(/[^\d.-]/g, '')}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/^0+/, '');
            const newValue = (numericValue || '0') + (value.match(/[a-z%]+/i) || 'px');
            setter(newValue);
            handleChange(property, newValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              const currentValue = parseFloat(value) || 0;
              const step = e.shiftKey ? 10 : 1;
              const newValue = e.key === 'ArrowUp' ? currentValue + step : currentValue - step;
              const unit = value.match(/[a-z%]+/i) || 'px';
              const updatedValue = `${newValue}${unit}`;
              setter(updatedValue);
              throttledHandleChange(property, updatedValue);
            }
          }}
          className="w-12 p-1 text-xs border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={value.match(/[a-z%]+/i)?.[0] || 'px'}
          onChange={(e) => {
            const numericPart = value.replace(/[^\d.-]/g, '') || '0';
            const newValue = numericPart + e.target.value;
            setter(newValue);
            handleChange(property, newValue);
          }}
          className="p-1 text-xs border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderPresetButtons = (presets, selectedPreset, applyPreset) => (
    <div className="flex justify-center items-center mb-4">
      <div className="inline-flex space-x-2">
        {Object.entries(presets).map(([name, value]) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
              selectedPreset === name
                ? "bg-[#cce7ff] text-blue-700 border-blue-300"
                : "bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Spacing Controls
      </h3>

      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Padding Presets
      </h4>
      {renderPresetButtons(
        PADDING_PRESETS,
        selectedPaddingPreset,
        applyPreset(
          PADDING_PRESETS,
          [setPaddingTop, setPaddingRight, setPaddingBottom, setPaddingLeft],
          "padding",
          selectedPaddingPreset,
          setSelectedPaddingPreset
        )
      )}

      {renderInputGroup(
        "Padding",
        [paddingTop, paddingRight, paddingBottom, paddingLeft],
        [setPaddingTop, setPaddingRight, setPaddingBottom, setPaddingLeft],
        ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]
      )}

      <h4 className="text-sm font-medium text-gray-700 mb-2 mt-6">
        Margin Presets
      </h4>
      {renderPresetButtons(
        MARGIN_PRESETS,
        selectedMarginPreset,
        applyPreset(
          MARGIN_PRESETS,
          [setMarginTop, setMarginRight, setMarginBottom, setMarginLeft],
          "margin",
          selectedMarginPreset,
          setSelectedMarginPreset
        )
      )}

      {renderInputGroup(
        "Margin",
        [marginTop, marginRight, marginBottom, marginLeft],
        [setMarginTop, setMarginRight, setMarginBottom, setMarginLeft],
        ["marginTop", "marginRight", "marginBottom", "marginLeft"]
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gap
        </label>
        <div className="flex">
          <input
            type="text"
            value={gap.split(/(\d+)/)[1] || ""}
            onChange={(e) => {
              const newValue = e.target.value + (gap.split(/(\d+)/)[2] || "px");
              setGap(newValue);
              handleChange("gap", newValue);
            }}
            className="w-full p-2 text-sm border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={gap.split(/(\d+)/)[2] || "px"}
            onChange={(e) => {
              const newValue = (gap.split(/(\d+)/)[1] || "0") + e.target.value;
              setGap(newValue);
              handleChange("gap", newValue);
            }}
            className="p-2 text-sm border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SpacingControls;
