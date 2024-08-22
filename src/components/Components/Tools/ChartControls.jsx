import React, { useState, useEffect } from 'react';
import ColorPicker from '../../common/ColorPicker';

const ChartControls = ({ style, onStyleChange }) => {
  const [chartType, setChartType] = useState('line');
  const [dataKeys, setDataKeys] = useState([]);
  const [nameKey, setNameKey] = useState('');
  const [chartColor, setChartColor] = useState('#000000');

  useEffect(() => {
    if (style) {
      setChartType(style.chartType || 'line');
      setDataKeys(style.dataKeys || []);
      setNameKey(style.nameKey || '');
      setChartColor(style.chartColor || '#000000');
    }
  }, [style]);

  const handleChange = (property, value) => {
    onStyleChange({ [property]: value });
  };

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => handleChange('chartType', e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="area">Area</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Data Keys (comma-separated)</label>
          <input
            type="text"
            value={dataKeys.join(',')}
            onChange={(e) => handleChange('dataKeys', e.target.value.split(','))}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Name Key</label>
          <input
            type="text"
            value={nameKey}
            onChange={(e) => handleChange('nameKey', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Chart Color</label>
          <ColorPicker
            color={chartColor}
            onChange={(color) => handleChange('chartColor', color)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartControls;