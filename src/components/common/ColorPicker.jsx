import React, { useState, useEffect, useRef, useCallback } from "react";
import { SketchPicker } from "react-color";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";

const COLOR_FORMATS = ["rgb", "hex", "hsl"];

const ColorPicker = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentFormat, setCurrentFormat] = useState("rgb");
  const [colorHistory, setColorHistory] = useState([]);
  const [internalColor, setInternalColor] = useState(color);
  const colorSwatchRef = useRef(null);
  const colorTheme = useSelector((state) => state.editor.colorTheme);

  const convertColor = useCallback((color, format) => {
    if (!color) return "";

    let rgbColor;
    if (typeof color === "string") {
      const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      const rgbMatch = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
      );
      const hslMatch = color.match(
        /^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*(\d+(?:\.\d+)?))?\)$/
      );

      if (hexMatch) {
        rgbColor = {
          r: parseInt(hexMatch[1], 16),
          g: parseInt(hexMatch[2], 16),
          b: parseInt(hexMatch[3], 16),
          a: 1,
        };
      } else if (rgbMatch) {
        rgbColor = {
          r: parseInt(rgbMatch[1]),
          g: parseInt(rgbMatch[2]),
          b: parseInt(rgbMatch[3]),
          a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
        };
      } else if (hslMatch) {
        // Convert HSL to RGB
        const h = parseInt(hslMatch[1]) / 360;
        const s = parseInt(hslMatch[2]) / 100;
        const l = parseInt(hslMatch[3]) / 100;
        const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;

        if (s === 0) {
          const v = Math.round(l * 255);
          rgbColor = { r: v, g: v, b: v, a };
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          rgbColor = {
            r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
            g: Math.round(hue2rgb(p, q, h) * 255),
            b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
            a,
          };
        }
      } else {
        return color; // Return as is if it's an invalid color string
      }
    } else if (color.rgb) {
      rgbColor = color.rgb;
    } else if (color.r !== undefined) {
      rgbColor = color;
    } else {
      return ""; // Return empty string if color is invalid
    }

    switch (format) {
      case "rgb":
        return `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${rgbColor.a})`;
      case "hsl":
        const r = rgbColor.r / 255;
        const g = rgbColor.g / 255;
        const b = rgbColor.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h,
          s,
          l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
            default:
              h = 0;
              break;
          }
          h /= 6;
        }

        return `hsla(${Math.round(h * 360)}, ${Math.round(
          s * 100
        )}%, ${Math.round(l * 100)}%, ${rgbColor.a})`;
      default:
        return `#${rgbColor.r.toString(16).padStart(2, "0")}${rgbColor.g
          .toString(16)
          .padStart(2, "0")}${rgbColor.b.toString(16).padStart(2, "0")}`;
    }
  }, []);

  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  useEffect(() => {
    if (internalColor && !colorHistory.includes(internalColor)) {
      setColorHistory((prevHistory) => {
        const newColor = convertColor(internalColor, "rgb");
        if (!prevHistory.some((c) => colorEquals(c, newColor))) {
          return [newColor, ...prevHistory.slice(0, 9)];
        }
        return prevHistory;
      });
    }
  }, [internalColor, colorHistory, convertColor]);

  const colorEquals = (color1, color2) => {
    return (
      color1.r === color2.r &&
      color1.g === color2.g &&
      color1.b === color2.b &&
      color1.a === color2.a
    );
  };

  const handleFormatChange = (format) => {
    setCurrentFormat(format);
    setInternalColor(convertColor(internalColor, format));
  };

  const handleColorChange = (newColor) => {
    // Switch to RGB format if transparency is being adjusted and we're not already in RGB format
    if (newColor.rgb.a !== 1 && currentFormat !== "rgb") {
      setCurrentFormat("rgb");
    }
    let formattedColor = convertColor(
      newColor,
      newColor.rgb.a !== 1 ? "rgb" : currentFormat
    );
    setInternalColor(formattedColor);
    onChange(formattedColor);
  };

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  // Add a new ref for the portal container
  const portalRef = useRef(null);

  useEffect(() => {
    // Create a div for the portal
    portalRef.current = document.createElement("div");
    document.body.appendChild(portalRef.current);

    // Clean up the portal div on unmount
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  const renderColorPickerPortal = () => {
    if (!displayColorPicker || !portalRef.current) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-[1000]"
        onClick={() => setDisplayColorPicker(false)}
      >
        <div
          className="absolute z-[1001]"
          style={{
            top: colorSwatchRef.current
              ? window.innerHeight -
                  colorSwatchRef.current.getBoundingClientRect().top >
                300
                ? colorSwatchRef.current.getBoundingClientRect().bottom + 5
                : colorSwatchRef.current.getBoundingClientRect().top - 300
              : 0,
            left: colorSwatchRef.current
              ? colorSwatchRef.current.getBoundingClientRect().left
              : 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden flex">
            <div className="p-3">
              <SketchPicker
                color={internalColor || "#000000"}
                onChange={handleColorChange}
                disableAlpha={false}
                presetColors={[]}
                styles={{
                  default: {
                    picker: {
                      boxShadow: "none",
                      padding: "0",
                      width: "200px",
                    },
                    body: { padding: "0" },
                    saturation: { width: "200px", height: "100px" },
                    hue: { height: "10px" },
                    alpha: { height: "10px" },
                  },
                }}
              />
            </div>
            <div className="border-l border-gray-200 p-3 w-48">
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                Theme Colors
              </h4>
              <div className="flex flex-wrap gap-1 mb-4">
                {colorTheme.map((themeColor, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-sm cursor-pointer border border-gray-300 shadow-sm transition-transform hover:scale-110"
                    style={{
                      backgroundColor:
                        typeof themeColor === "string"
                          ? themeColor
                          : themeColor.value,
                    }}
                    onClick={() =>
                      onChange(
                        typeof themeColor === "string"
                          ? themeColor
                          : themeColor.value
                      )
                    }
                    title={themeColor.name || `Color ${index + 1}`}
                  />
                ))}
              </div>
              {colorHistory.length > 0 && (
                <>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Recent Colors
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {colorHistory.slice(0, 10).map((historyColor, index) => (
                      <div
                        key={index}
                        className="w-5 h-5 rounded-sm cursor-pointer border border-gray-300 shadow-sm transition-transform hover:scale-110"
                        style={{
                          backgroundColor: convertColor(historyColor, "rgb"),
                        }}
                        onClick={() =>
                          onChange(convertColor(historyColor, currentFormat))
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>,
      portalRef.current
    );
  };

  return (
    <div className="color-picker relative">
      <div className="flex items-center mb-2">
        <div
          ref={colorSwatchRef}
          className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 shadow-sm"
          style={{ backgroundColor: internalColor || "transparent" }}
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
        />
        <input
          type="text"
          value={internalColor}
          onChange={(e) => {
            setInternalColor(e.target.value);
            onChange(e.target.value);
          }}
          className="ml-2 flex-grow p-2 text-sm border w-14 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={currentFormat}
          onChange={(e) => handleFormatChange(e.target.value)}
          className="ml-2 p-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {COLOR_FORMATS.map((format) => (
            <option key={format} value={format}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {renderColorPickerPortal()}
    </div>
  );
};

export default ColorPicker;
