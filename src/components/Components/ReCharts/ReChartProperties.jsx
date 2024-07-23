import React from 'react';
import { componentConfig, componentTypes } from '../componentConfig';
import ChartStyleOptions from './ChartStyleOptions';

const ReChartProperties = ({ chartConfig, onChartConfigChange }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Type</label>
        <select
          name="chartType"
          value={chartConfig?.chartType || 'line'}
          onChange={onChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {componentConfig[componentTypes.CHART].chartTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Data Key</label>
        <input
          type="text"
          name="dataKey"
          value={chartConfig?.dataKey || ''}
          onChange={onChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name Key</label>
        <input
          type="text"
          name="nameKey"
          value={chartConfig?.nameKey || ''}
          onChange={onChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Data (JSON)</label>
        <textarea
          name="data"
          value={JSON.stringify(chartConfig?.data || [], null, 2)}
          onChange={onChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="5"
        />
      </div>
    </>
  );
};

export default ReChartProperties;