import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';

const COLOR_FORMATS = ['hex', 'rgb', 'hsl'];
const COLOR_PRESETS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const ColorPicker = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentFormat, setCurrentFormat] = useState('hex');
  const [colorHistory, setColorHistory] = useState([]);
  const [internalColor, setInternalColor] = useState(color);
  const colorSwatchRef = useRef(null);

  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  useEffect(() => {
    if (internalColor && !colorHistory.includes(internalColor)) {
      setColorHistory(prevHistory => {
        const newColor = convertColor(internalColor, 'rgb'); // Convert to RGB for consistency
        if (!prevHistory.some(c => colorEquals(c, newColor))) {
          return [newColor, ...prevHistory.slice(0, 9)];
        }
        return prevHistory;
      });
    }
  }, [internalColor]);

  const colorEquals = (color1, color2) => {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b && color1.a === color2.a;
  };

  const handleFormatChange = (format) => {
    setCurrentFormat(format);
    setInternalColor(convertColor(internalColor, format));
  };

  const handleColorChange = (newColor) => {
    let formattedColor = convertColor(newColor, currentFormat);
    setInternalColor(formattedColor);
    onChange(formattedColor);
  };

  const convertColor = (color, format) => {
    if (!color) return '';

    let rgbColor;
    if (typeof color === 'string') {
      const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      const hslMatch = color.match(/^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      if (hexMatch) {
        rgbColor = {
          r: parseInt(hexMatch[1], 16),
          g: parseInt(hexMatch[2], 16),
          b: parseInt(hexMatch[3], 16),
          a: 1
        };
      } else if (rgbMatch) {
        rgbColor = {
          r: parseInt(rgbMatch[1]),
          g: parseInt(rgbMatch[2]),
          b: parseInt(rgbMatch[3]),
          a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
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
            r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
            g: Math.round(hue2rgb(p, q, h) * 255),
            b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
            a
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
      return ''; // Return empty string if color is invalid
    }

    switch (format) {
      case 'rgb':
        return `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${rgbColor.a})`;
      case 'hsl':
        const r = rgbColor.r / 255;
        const g = rgbColor.g / 255;
        const b = rgbColor.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${rgbColor.a})`;
      default:
        return `#${rgbColor.r.toString(16).padStart(2, '0')}${rgbColor.g.toString(16).padStart(2, '0')}${rgbColor.b.toString(16).padStart(2, '0')}`;
    }
  };

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  return (
    <div className="color-picker relative">
      <div className="flex items-center mb-2">
        <div
          ref={colorSwatchRef}
          className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 shadow-sm"
          style={{ backgroundColor: internalColor || 'transparent' }}
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
          {COLOR_FORMATS.map(format => (
            <option key={format} value={format}>{format.toUpperCase()}</option>
          ))}
        </select>
      </div>
      
      {displayColorPicker && (
        <div className="fixed inset-0 z-[1000]" onClick={() => setDisplayColorPicker(false)}>
          <div 
            className="absolute z-[1001]"
            style={{
              top: colorSwatchRef.current
                ? window.innerHeight - colorSwatchRef.current.getBoundingClientRect().top > 300
                  ? colorSwatchRef.current.getBoundingClientRect().bottom + 5
                  : colorSwatchRef.current.getBoundingClientRect().top - 300
                : 0,
              left: colorSwatchRef.current ? colorSwatchRef.current.getBoundingClientRect().left : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SketchPicker
              color={internalColor || '#000000'}
              onChange={handleColorChange}
              presetColors={[...COLOR_PRESETS, ...colorHistory]}
              disableAlpha={currentFormat === 'hex'}
            />
          </div>
        </div>
      )}
      
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Presets</h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((presetColor) => (
            <div
              key={presetColor}
              className="w-6 h-6 rounded-md cursor-pointer border border-gray-300 shadow-sm"
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </div>
      </div>
      
      {colorHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Colors</h4>
          <div className="flex flex-wrap gap-2">
            {colorHistory.map((historyColor, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-md cursor-pointer border border-gray-300 shadow-sm"
                style={{ backgroundColor: convertColor(historyColor, 'rgb') }}
                onClick={() => onChange(convertColor(historyColor, currentFormat))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;