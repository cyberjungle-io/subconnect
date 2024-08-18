import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueries } from '../../../w3s/w3sSlice'; // Adjust the import path as needed
import { FaChevronUp, FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';

const ChartStyleOptions = ({ chartConfig, onChartConfigChange }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const queriesStatus = useSelector(state => state.w3s.queries.status);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [localChartConfig, setLocalChartConfig] = useState(chartConfig);

  useEffect(() => {
    console.log('Dispatching fetchQueries'); // Log 7
    dispatch(fetchQueries());
  }, [dispatch]);

  useEffect(() => {
    console.log('Queries in ChartStyleOptions:', queries); // Log 8
    console.log('Queries status:', queriesStatus); // Log 9
  }, [queries, queriesStatus]);

  useEffect(() => {
    setLocalChartConfig(chartConfig);
  }, [chartConfig]);

  useEffect(() => {
    if (localChartConfig.selectedQueryId) {
      const query = queries.find(q => q._id === localChartConfig.selectedQueryId);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields);
      }
    }
  }, [localChartConfig.selectedQueryId, queries]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setLocalChartConfig(prev => ({
      ...prev,
      [name]: newValue
    }));

    onChartConfigChange({
      target: {
        name,
        value: newValue,
      },
    });

    if (name === 'selectedQueryId') {
      const query = queries.find(q => q._id === value);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields);
        // Reset dataKey and nameKey when changing the query
        setLocalChartConfig(prev => ({
          ...prev,
          dataKey: '',
          nameKey: ''
        }));
        onChartConfigChange({ target: { name: 'dataKey', value: '' } });
        onChartConfigChange({ target: { name: 'nameKey', value: '' } });
      }
    }
  };

  const legendPositionIcons = [
    { position: 'top', icon: FaChevronUp, tooltip: 'Top' },
    { position: 'right', icon: FaChevronRight, tooltip: 'Right' },
    { position: 'bottom', icon: FaChevronDown, tooltip: 'Bottom' },
    { position: 'left', icon: FaChevronLeft, tooltip: 'Left' },
  ];

  return (
    <div className="chart-style-options">
      {/* Debug render */}
      <div style={{background: '#f0f0f0', padding: '10px', marginBottom: '10px'}}>
        <h4>Debug Info</h4>
        <p>Queries Status: {queriesStatus}</p>
        <p>Queries Count: {queries.length}</p>
        <p>Selected Query ID: {chartConfig.selectedQueryId}</p>
      </div>

      {/* Query Selection */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Data Source</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Query</label>
        <select
          name="selectedQueryId"
          value={localChartConfig.selectedQueryId || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a query</option>
          {queries.map(query => (
            <option key={query._id} value={query._id}>{query.name}</option>
          ))}
        </select>
      </div>
      {queriesStatus === 'loading' && <p>Loading queries...</p>}
      {queriesStatus === 'failed' && <p>Failed to load queries</p>}
      {queriesStatus === 'succeeded' && queries.length === 0 && <p>No queries available</p>}

      {/* Field Selection */}
      {selectedQuery && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Key (Y-axis)</label>
            <select
              name="dataKey"
              value={localChartConfig.dataKey || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a field</option>
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name Key (X-axis)</label>
            <select
              name="nameKey"
              value={localChartConfig.nameKey || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a field</option>
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Chart Title */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Title Styling</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Title</label>
        <input
          type="text"
          name="title"
          value={localChartConfig.title || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Font Size</label>
        <input
          type="number"
          name="titleFontSize"
          value={localChartConfig.titleFontSize || 16}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Color</label>
        <input
          type="color"
          name="titleColor"
          value={localChartConfig.titleColor || '#000000'}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Alignment</label>
        <select
          name="titleAlign"
          value={localChartConfig.titleAlign || 'center'}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Chart Dimensions */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Chart Dimensions</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Width</label>
        <input
          type="number"
          name="width"
          value={localChartConfig.width || 500}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Height</label>
        <input
          type="number"
          name="height"
          value={localChartConfig.height || 300}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Chart Type Specific Styling */}
      {localChartConfig.chartType === 'line' && (
        <>
          <h4 className="text-md font-medium text-gray-900 mt-2">Line Customization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Color</label>
            <input
              type="color"
              name="lineColor"
              value={localChartConfig.lineColor || '#8884d8'}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Width</label>
            <input
              type="number"
              name="lineWidth"
              value={localChartConfig.lineWidth || 2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Point Size</label>
            <input
              type="number"
              name="dataPointSize"
              value={localChartConfig.dataPointSize || 5}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      )}

      {localChartConfig.chartType === 'bar' && (
        <>
          <h4 className="text-md font-medium text-gray-900 mt-2">Bar Customization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bar Color</label>
            <input
              type="color"
              name="barColor"
              value={localChartConfig.barColor || '#8884d8'}
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
              value={localChartConfig.barOpacity || 1}
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
          checked={localChartConfig.showLegend || false}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      {localChartConfig.showLegend && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Legend Position</label>
          <div className="flex justify-center space-x-2">
            {legendPositionIcons.map(({ position, icon: Icon, tooltip }) => (
              <button
                key={position}
                onClick={() => handleChange({ target: { name: 'legendPosition', value: position } })}
                className={`p-2 rounded-md ${
                  localChartConfig.legendPosition === position
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={tooltip}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartStyleOptions;