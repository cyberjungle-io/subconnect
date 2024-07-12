import React from 'react';
import { componentConfig, componentTypes } from '../Components/componentConfig';

const PropertiesPanel = ({ selectedComponent, onUpdateComponent, onDeleteComponent }) => {
  if (!selectedComponent) {
    return (
      <div className="w-64 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <p>No component selected</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdateComponent(selectedComponent.id, { [name]: value });
  };

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    onUpdateComponent(selectedComponent.id, { style: { ...selectedComponent.style, [name]: value } });
  };
  const handleChartConfigChange = (e) => {
    const { name, value } = e.target;
    onUpdateComponent(selectedComponent.id, { 
      chartConfig: { 
        ...selectedComponent.chartConfig, 
        [name]: name === 'data' ? JSON.parse(value) : value 
      } 
    });
  };
  
  const renderChartProperties = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Type</label>
        <select
          name="chartType"
          value={selectedComponent.chartConfig?.chartType || 'line'}
          onChange={handleChartConfigChange}
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
          value={selectedComponent.chartConfig?.dataKey || ''}
          onChange={handleChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name Key</label>
        <input
          type="text"
          name="nameKey"
          value={selectedComponent.chartConfig?.nameKey || ''}
          onChange={handleChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Data (JSON)</label>
        <textarea
          name="data"
          value={JSON.stringify(selectedComponent.chartConfig?.data || [], null, 2)}
          onChange={handleChartConfigChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="5"
        />
      </div>
    </>
  );

  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <input type="text" value={selectedComponent.type} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        {selectedComponent.content !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <input type="text" name="content" value={selectedComponent.content} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        )}
        {selectedComponent.type === 'ROW' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Align Items</label>
              <select name="alignItems" value={selectedComponent.style.alignItems || 'stretch'} onChange={handleStyleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="stretch">Stretch</option>
                <option value="flex-start">Top</option>
                <option value="center">Center</option>
                <option value="flex-end">Bottom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Justify Content</label>
              <select name="justifyContent" value={selectedComponent.style.justifyContent || 'flex-start'} onChange={handleStyleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gap</label>
              <input type="text" name="gap" value={selectedComponent.style.gap || '0px'} onChange={handleStyleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </>
        )}
        {selectedComponent.type === 'CHART' && renderChartProperties()}
        <div>
          <label className="block text-sm font-medium text-gray-700">Width</label>
          <input type="text" name="width" value={selectedComponent.style.width} onChange={handleStyleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height</label>
          <input type="text" name="height" value={selectedComponent.style.height} onChange={handleStyleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button onClick={() => onDeleteComponent(selectedComponent.id)} className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Component</button>
      </div>
    </div>
  );
};

export default PropertiesPanel;