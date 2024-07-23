import React from 'react';
import { FaChevronUp, FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';

const ChartStyleOptions = ({ chartConfig, onChartConfigChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChartConfigChange({
      target: {
        name,
        value: type === 'checkbox' ? checked : value,
      },
    });
  };

  const legendPositionIcons = [
    {
      position: 'top',
      icon: (selected) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M2 2 H22" stroke="currentColor" strokeWidth="2" />
          {selected && <path d="M2 2 H22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />}
        </svg>
      ),
      tooltip: 'Top'
    },
    {
      position: 'right',
      icon: (selected) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M22 2 V22" stroke="currentColor" strokeWidth="2" />
          {selected && <path d="M22 2 V22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />}
        </svg>
      ),
      tooltip: 'Right'
    },
    {
      position: 'bottom',
      icon: (selected) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M2 22 H22" stroke="currentColor" strokeWidth="2" />
          {selected && <path d="M2 22 H22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />}
        </svg>
      ),
      tooltip: 'Bottom'
    },
    {
      position: 'left',
      icon: (selected) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M2 2 V22" stroke="currentColor" strokeWidth="2" />
          {selected && <path d="M2 2 V22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />}
        </svg>
      ),
      tooltip: 'Left'
    },
  ];

  return (
    <div className="chart-style-options">
      {/* Chart Title */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Title Styling</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Title</label>
        <input
          type="text"
          name="title"
          value={chartConfig.title || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Font Size</label>
        <input
          type="number"
          name="titleFontSize"
          value={chartConfig.titleFontSize || 16}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Color</label>
        <input
          type="color"
          name="titleColor"
          value={chartConfig.titleColor || '#000000'}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Alignment</label>
        <select
          name="titleAlign"
          value={chartConfig.titleAlign || 'center'}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Chart Dimensions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Width</label>
        <input
          type="number"
          name="width"
          value={chartConfig.width || 500}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Height</label>
        <input
          type="number"
          name="height"
          value={chartConfig.height || 300}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Chart Type Specific Styling */}
      {chartConfig.chartType === 'line' && (
        <>
          <h4 className="text-md font-medium text-gray-900 mt-2">Line Customization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Color</label>
            <input
              type="color"
              name="lineColor"
              value={chartConfig.lineColor || '#8884d8'}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Width</label>
            <input
              type="number"
              name="lineWidth"
              value={chartConfig.lineWidth || 2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Point Size</label>
            <input
              type="number"
              name="dataPointSize"
              value={chartConfig.dataPointSize || 5}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      )}

      {chartConfig.chartType === 'bar' && (
        <>
          <h4 className="text-md font-medium text-gray-900 mt-2">Bar Customization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bar Color</label>
            <input
              type="color"
              name="barColor"
              value={chartConfig.barColor || '#8884d8'}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bar Opacity</label>
            <input
              type="number"
              name="barOpacity"
              min="0"
              max="1"
              step="0.1"
              value={chartConfig.barOpacity || 1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      )}

      {/* Legend Customization */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Legend Customization</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Show Legend</label>
        <input
          type="checkbox"
          name="showLegend"
          checked={chartConfig.showLegend || false}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      {chartConfig.showLegend && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Legend Position</label>
          <div className="flex justify-center space-x-2">
            {legendPositionIcons.map(({ position, icon, tooltip }) => (
              <button
                key={position}
                onClick={() => handleChange({ target: { name: 'legendPosition', value: position } })}
                className={`p-2 rounded-md ${
                  chartConfig.legendPosition === position
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={tooltip}
              >
                {icon(chartConfig.legendPosition === position)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartStyleOptions;