import React, { useState, useCallback, useEffect } from "react";
import ColorPicker from "../../common/ColorPicker";

const SHADOW_PRESETS = {
  subtle: {
    x: "0px",
    y: "2px",
    blur: "4px",
    spread: "0px",
    color: "#000000",
    opacity: 0.15,
    description: "A light, small shadow",
  },
  medium: {
    x: "0px",
    y: "4px",
    blur: "8px",
    spread: "0px",
    color: "#000000",
    opacity: 0.2,
    description: "A balanced, medium-sized shadow",
  },
  harsh: {
    x: "4px",
    y: "4px",
    blur: "8px",
    spread: "0px",
    color: "#000000",
    opacity: 0.25,
    description: "A stronger, more visible shadow",
  },
  floating: {
    x: "0px",
    y: "8px",
    blur: "16px",
    spread: "-2px",
    color: "#000000",
    opacity: 0.25,
    description: "An elevated effect with negative spread",
  },
  layered: {
    x: "0px",
    y: "2px",
    blur: "4px",
    spread: "0px",
    color: "#000000",
    opacity: 0.2,
    description: "A subtle, close shadow good for cards",
  },
};

const INNER_SHADOW_PRESETS = {
  subtle: {
    blur: "4px",
    spread: "0px",
    color: "#000000",
    opacity: 0.15,
    description: "A light inner shadow",
  },
  medium: {
    blur: "10px",
    spread: "3px",
    color: "#000000",
    opacity: 0.25,
    description: "A balanced inner shadow",
  },
  deep: {
    blur: "16px",
    spread: "6px",
    color: "#000000",
    opacity: 0.3,
    description: "A pronounced inner shadow",
  },
  pressed: {
    blur: "2px",
    spread: "1px",
    color: "#000000",
    opacity: 0.3,
    description: "A tight inner shadow for pressed states",
  },
  hollow: {
    blur: "16px",
    spread: "8px",
    color: "#000000",
    opacity: 0.15,
    description: "A soft, spread-out inner shadow",
  },
};

const INITIAL_SHADOW_STATE = {
  inner: {
    ...INNER_SHADOW_PRESETS.subtle,
    color: '#000000',
  },
  outer: {
    ...SHADOW_PRESETS.subtle,
    color: '#000000',
  },
};

const activeButtonClass =
  "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-[#cce7ff] text-blue-700 border-blue-300";
const inactiveButtonClass =
  "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]";

export const ShadowControlsPanel = ({
  onStyleChange,
  showInnerShadow,
  showOuterShadow,
  style,
  onToggleInnerShadow,
  onToggleOuterShadow,
}) => {
  const [activePreset, setActivePreset] = useState(null);
  const [activeInnerPreset, setActiveInnerPreset] = useState(null);

  const [innerShadow, setInnerShadow] = useState(INITIAL_SHADOW_STATE.inner);
  const [outerShadow, setOuterShadow] = useState(INITIAL_SHADOW_STATE.outer);

  // Parse shadow string into components
  const parseShadowString = useCallback((shadowString) => {
    if (!shadowString || shadowString === "none") return null;

    // Fix: Improved regex to capture the entire rgba value
    const rgbaMatch = shadowString.match(/rgba\([^)]+\)/);
    const color = rgbaMatch ? rgbaMatch[0] : shadowString.split(" ").slice(-1)[0];

    // Remove the rgba part from the string to parse other values
    const parts = shadowString
      .replace(rgbaMatch?.[0] || "", "")
      .trim()
      .split(/\s+/);
    const isInner = parts[0] === "inset";
    const startIndex = isInner ? 1 : 0;

    // Fix: Properly handle rgba values
    let parsedColor, opacity;
    if (color.startsWith('rgba')) {
      const rgbaValues = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (rgbaValues) {
        const [_, r, g, b, a] = rgbaValues;
        parsedColor = color; // Keep the full rgba color
        opacity = parseFloat(a);
      } else {
        parsedColor = '#000000';
        opacity = 1;
      }
    } else {
      parsedColor = color;
      opacity = 1;
    }

    return {
      x: isInner ? "0px" : parts[startIndex] || "0px",
      y: isInner ? "0px" : parts[startIndex + 1] || "0px",
      blur: parts[startIndex + 2] || "4px",
      spread: parts[startIndex + 3] || "0px",
      color: parsedColor,
      opacity: opacity,
    };
  }, []);

  // Update state when style changes
  useEffect(() => {
    console.log("Style changed:", style?.boxShadow);
    if (style?.boxShadow && style.boxShadow !== "none") {
      // Fix: Use regex to properly split shadows while preserving rgba() values
      const shadows = style.boxShadow
        .split(/,(?![^(]*\))/g)
        .map((s) => s.trim());
      console.log("Parsed shadows:", shadows);

      // Determine shadow types present
      const hasInnerShadow = shadows.some((s) => s.includes("inset"));
      const hasOuterShadow = shadows.some((s) => !s.includes("inset"));
      console.log(
        "Shadow detection - Inner:",
        hasInnerShadow,
        "Outer:",
        hasOuterShadow
      );

      // Only update states for shadows that are actually present
      shadows.forEach((shadowStr) => {
        const parsedShadow = parseShadowString(shadowStr);
        console.log(
          "Parsed shadow string:",
          shadowStr,
          "Result:",
          parsedShadow
        );
        if (parsedShadow) {
          const isInner = shadowStr.includes("inset");
          if (isInner) {
            setInnerShadow((prev) => ({ ...prev, ...parsedShadow }));
            // Don't update outer shadow state
          } else {
            setOuterShadow((prev) => ({ ...prev, ...parsedShadow }));
            // Don't update inner shadow state
          }
        }
      });

      // Update visibility states only if they don't match the current shadow presence
      if (hasInnerShadow !== showInnerShadow) {
        onToggleInnerShadow();
      }
      if (hasOuterShadow !== showOuterShadow) {
        onToggleOuterShadow();
      }
    } else {
      // If no shadow or "none", reset both states
      if (showInnerShadow) {
        onToggleInnerShadow();
      }
      if (showOuterShadow) {
        onToggleOuterShadow();
      }
    }
  }, [
    style?.boxShadow,
    parseShadowString,
    showInnerShadow,
    showOuterShadow,
    onToggleInnerShadow,
    onToggleOuterShadow,
  ]);

  const handleShadowChange = useCallback(() => {
    console.log('handleShadowChange called');
    console.log('Current states:', {
      showInnerShadow,
      showOuterShadow,
      innerShadow,
      outerShadow
    });

    const shadows = [];

    if (showInnerShadow && innerShadow) {
      const { blur, spread, color, opacity } = innerShadow;
      // If color is already in rgba format, use it directly
      const rgba = color?.startsWith('rgba') 
        ? color 
        : color 
          ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
          : `rgba(0, 0, 0, ${opacity})`;
      shadows.push(`inset 0 0 ${blur} ${spread} ${rgba}`);
      console.log('Added inner shadow:', shadows[shadows.length - 1]);
    }

    if (showOuterShadow && outerShadow) {
      const { color, opacity, blur, spread, x, y } = outerShadow;
      const rgba = color?.startsWith('rgba') 
        ? color 
        : color 
          ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
          : `rgba(0, 0, 0, ${opacity})`;
      shadows.push(`${x} ${y} ${blur} ${spread} ${rgba}`);
      console.log('Added outer shadow:', shadows[shadows.length - 1]);
    }

    const boxShadow = shadows.length > 0 ? shadows.join(", ") : "none";
    console.log('Final box-shadow value:', boxShadow);
    
    // Use requestAnimationFrame to ensure state is updated
    requestAnimationFrame(() => {
      onStyleChange({
        style: { boxShadow },
      });
    });
  }, [
    innerShadow,
    outerShadow,
    showInnerShadow,
    showOuterShadow,
    onStyleChange,
  ]);

  const handleManualChange = useCallback(
    (updates) => {
      console.log('handleManualChange called with:', updates);
      setOuterShadow((prev) => {
        console.log('Previous outer shadow state:', prev);
        const newState = { ...prev };
        
        if (updates.color) {
          console.log('Updating outer shadow color to:', updates.color);
          newState.color = updates.color;
        } else {
          Object.assign(newState, updates);
        }
        
        console.log('New outer shadow state:', newState);
        return newState;
      });
      setActivePreset(null);
      setTimeout(handleShadowChange, 0);
    },
    [handleShadowChange]
  );

  const handleManualInnerChange = useCallback(
    (updates) => {
      console.log('handleManualInnerChange called with:', updates);
      setInnerShadow((prev) => {
        console.log('Previous inner shadow state:', prev);
        const newState = { ...prev };
        
        if (updates.color) {
          console.log('Updating inner shadow color to:', updates.color);
          newState.color = updates.color;
        } else {
          Object.assign(newState, updates);
        }
        
        console.log('New inner shadow state:', newState);
        return newState;
      });
      setActiveInnerPreset(null);
      setTimeout(handleShadowChange, 0);
    },
    [handleShadowChange]
  );

  const applyPreset = useCallback(
    (presetName) => {
      const preset = SHADOW_PRESETS[presetName];

      const { color, opacity, blur, spread, x, y } = preset;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      const boxShadow = `${x} ${y} ${blur} ${spread} ${rgba}`;

      setOuterShadow(preset);
      setActivePreset(presetName);

      if (!showOuterShadow) {
        onToggleOuterShadow();
      }

      onStyleChange({ style: { boxShadow } });
    },
    [showOuterShadow, onToggleOuterShadow, onStyleChange]
  );

  const applyInnerPreset = useCallback(
    (presetName) => {
      const preset = INNER_SHADOW_PRESETS[presetName];

      const { blur, spread, color, opacity } = preset;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      const boxShadow = `inset 0 0 ${blur} ${spread} ${rgba}`;

      setInnerShadow(preset);
      setActiveInnerPreset(presetName);

      if (!showInnerShadow) {
        onToggleInnerShadow();
      }

      onStyleChange({ style: { boxShadow } });
    },
    [showInnerShadow, onToggleInnerShadow, onStyleChange]
  );

  const handleToggleInnerShadow = () => {
    console.log(
      "Before toggle - Inner:",
      showInnerShadow,
      "Outer:",
      showOuterShadow
    );

    // Batch our state updates
    const newShowInnerShadow = !showInnerShadow;

    // Create the new shadow string first
    const shadows = [];

    // Only add outer shadow if it's currently enabled
    if (showOuterShadow && outerShadow) {
      const { color, opacity, blur, spread, x, y } = outerShadow;
      if (color && typeof opacity === "number") {
        const rgba = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
        shadows.push(`${x} ${y} ${blur} ${spread} ${rgba}`);
      }
    }

    // Add inner shadow if we're enabling it
    if (newShowInnerShadow && innerShadow) {
      const { blur, spread, color, opacity } = innerShadow;
      if (color && typeof opacity === "number") {
        const rgba = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
        shadows.push(`inset 0 0 ${blur} ${spread} ${rgba}`);
      }
    }

    const boxShadow = shadows.length > 0 ? shadows.join(", ") : "none";

    // Batch our updates together
    Promise.resolve().then(() => {
      onStyleChange({ style: { boxShadow } });
      onToggleInnerShadow();
    });
  };

  const handleToggleOuterShadow = () => {
    // First update the shadow state
    const newShowOuterShadow = !showOuterShadow;
    onToggleOuterShadow();

    // Then immediately update shadows based on the new state
    const shadows = [];

    // Only include inner shadow if it's already enabled
    if (showInnerShadow && innerShadow && !newShowOuterShadow) {
      const { blur, spread, color, opacity } = innerShadow;
      if (color && typeof opacity === "number") {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        shadows.push(`inset 0 0 ${blur} ${spread} ${rgba}`);
      }
    }

    if (newShowOuterShadow && outerShadow) {
      const { color, opacity, blur, spread, x, y } = outerShadow;
      if (color && typeof opacity === "number") {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        shadows.push(`${x} ${y} ${blur} ${spread} ${rgba}`);
      }
    }

    const boxShadow = shadows.length > 0 ? shadows.join(", ") : "none";
    onStyleChange({ style: { boxShadow } });
  };

  return (
    <div className="space-y-4">
      {/* Inner Shadow Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Inner Shadow</h3>
        <button
          onClick={handleToggleInnerShadow}
          className={`w-full px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
            showInnerShadow
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          }`}
        >
          {showInnerShadow ? "Remove Shadow" : "Add Shadow"}
        </button>

        {/* Only show inner shadow controls when inner shadow is enabled */}
        {showInnerShadow && (
          <div className="space-y-4 mt-4">
            {/* Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(INNER_SHADOW_PRESETS).map(
                  ([presetName, preset]) => (
                    <button
                      key={presetName}
                      onClick={() => applyInnerPreset(presetName)}
                      title={preset.description}
                      className={
                        presetName === activeInnerPreset
                          ? activeButtonClass
                          : inactiveButtonClass
                      }
                    >
                      {presetName}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Inner Shadow Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blur
              </label>
              <input
                type="number"
                value={parseFloat(innerShadow.blur)}
                onChange={(e) => {
                  handleManualInnerChange({ blur: `${e.target.value}px` });
                }}
                className="w-full p-2 text-sm border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Spread
              </label>
              <input
                type="number"
                value={parseFloat(innerShadow.spread)}
                onChange={(e) => {
                  handleManualInnerChange({ spread: `${e.target.value}px` });
                }}
                className="w-full p-2 text-sm border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="space-y-2" 
                  onClick={(e) => {
                    console.log('ColorPicker container clicked');
                    e.stopPropagation();
                  }}>
                <ColorPicker
                  color={innerShadow.color}
                  onChange={(newColor) => {
                    console.log('ColorPicker onChange called with:', newColor);
                    handleManualInnerChange({ color: newColor });
                  }}
                />
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
                      handleManualInnerChange({
                        opacity: parseFloat(e.target.value),
                      });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Outer Shadow Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Outer Shadow</h3>
        <button
          onClick={handleToggleOuterShadow}
          className={`w-full px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
            showOuterShadow
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          }`}
        >
          {showOuterShadow ? "Remove Shadow" : "Add Shadow"}
        </button>

        {/* Only show outer shadow controls when outer shadow is enabled */}
        {showOuterShadow && (
          <div className="space-y-4 mt-4">
            {/* Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SHADOW_PRESETS).map(([presetName, preset]) => (
                  <button
                    key={presetName}
                    onClick={() => applyPreset(presetName)}
                    title={preset.description}
                    className={
                      presetName === activePreset
                        ? activeButtonClass
                        : inactiveButtonClass
                    }
                  >
                    {presetName}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    X Offset
                  </label>
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
                  <label className="block text-xs text-gray-600">
                    Y Offset
                  </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Blur
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Spread
                </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <ColorPicker
                  color={outerShadow.color}
                  onChange={(newColor) => {
                    handleManualChange({ color: newColor });
                  }}
                />
                <div>
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
                      handleManualChange({
                        opacity: parseFloat(e.target.value),
                      });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShadowControlsPanel;
