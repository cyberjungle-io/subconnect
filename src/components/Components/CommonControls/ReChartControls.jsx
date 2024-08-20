import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueries } from '../../../w3s/w3sSlice';
import { executeQuery } from '../../../features/graphQLSlice';
import { FaChevronUp, FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { componentConfig, componentTypes } from '../componentConfig';
import { format } from 'date-fns';

const ReChartControls = ({ component, onUpdate }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const queriesStatus = useSelector(state => state.w3s.queries.status);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    dispatch(fetchQueries());
  }, [dispatch]);

  useEffect(() => {
    if (component.props.selectedQueryId) {
      const query = queries.find(q => q._id === component.props.selectedQueryId);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields.map(field => ({
          ...field,
          name: field.name.split('.').pop() // Remove the high-level dataset name
        })));
      }
    }
  }, [component.props.selectedQueryId, queries]);

  useEffect(() => {
    if (queryResult && queryResult.parsedData) {
      setChartData(queryResult.parsedData);
    }
  }, [queryResult]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'dataKeys') {
      newValue = Array.from(e.target.selectedOptions, option => option.value);
    }

    const updatedProps = {
      ...component.props,
      [name]: newValue
    };

    if (name === 'selectedQueryId') {
      const query = queries.find(q => q._id === value);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields.map(field => ({
          ...field,
          name: field.name.split('.').pop() // Remove the high-level dataset name
        })));
        updatedProps.dataKeys = [];
        updatedProps.nameKey = '';
      }
    }

    if (name === 'lineColor') {
      const [dataKey, color] = value.split('|');
      updatedProps.lineColors = {
        ...component.props.lineColors,
        [dataKey]: color
      };
    } else {
      updatedProps[name] = newValue;
    }

    onUpdate({ props: updatedProps });

    // Execute query when both dataKeys and nameKey are selected
    if ((name === 'dataKeys' || name === 'nameKey') && selectedQuery) {
      if (updatedProps.dataKeys.length > 0 && updatedProps.nameKey) {
        try {
          const result = await dispatch(executeQuery({
            endpoint: selectedQuery.endpoint,
            query: selectedQuery.queryString
          })).unwrap();
          
          if (result.data) {
            const dataKey = Object.keys(result.data)[0];
            const newChartData = result.data[dataKey];
            setChartData(newChartData);
            
            // Update the chart data in the parent component
            onUpdate({
              props: {
                ...updatedProps,
                data: newChartData
              }
            });
          }
        } catch (error) {
          console.error('Error executing query:', error);
        }
      }
    }
  };

  const legendPositionIcons = [
    { position: 'top', icon: FaChevronUp, tooltip: 'Top' },
    { position: 'right', icon: FaChevronRight, tooltip: 'Right' },
    { position: 'bottom', icon: FaChevronDown, tooltip: 'Bottom' },
    { position: 'left', icon: FaChevronLeft, tooltip: 'Left' },
  ];

  if (!component.props) {
    return <div>No chart configuration available.</div>;
  }

  return (
    <div className="chart-controls">
      <h4>Chart Properties</h4>
      
      {/* Chart Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Type</label>
        <select
          name="chartType"
          value={component.props.chartType || 'line'}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="area">Area Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* Debug render */}
      <div style={{background: '#f0f0f0', padding: '10px', marginBottom: '10px'}}>
        <h4>Debug Info</h4>
        <p>Queries Status: {queriesStatus}</p>
        <p>Queries Count: {queries.length}</p>
        <p>Selected Query ID: {component.props.selectedQueryId}</p>
      </div>

      {/* Query Selection */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Data Source</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Query</label>
        <select
          name="selectedQueryId"
          value={component.props.selectedQueryId || ''}
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
            <label className="block text-sm font-medium text-gray-700">Data Keys (Y-axis)</label>
            <select
              multiple
              name="dataKeys"
              value={component.props.dataKeys || []}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name Key (X-axis)</label>
            <select
              name="nameKey"
              value={component.props.nameKey || ''}
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
          value={component.props.title || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Font Size</label>
        <input
          type="number"
          name="titleFontSize"
          value={component.props.titleFontSize || 16}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Color</label>
        <input
          type="color"
          name="titleColor"
          value={component.props.titleColor || '#000000'}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title Alignment</label>
        <select
          name="titleAlign"
          value={component.props.titleAlign || 'center'}
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
          value={component.props.width || 500}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Height</label>
        <input
          type="number"
          name="height"
          value={component.props.height || 300}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Chart Type Specific Styling */}
      {component.props.chartType === 'line' && (
        <>
          <h4 className="text-md font-medium text-gray-900 mt-2">Line Customization</h4>
          {component.props.dataKeys.map((dataKey) => (
            <div key={dataKey}>
              <label className="block text-sm font-medium text-gray-700">
                {dataKey} Color
              </label>
              <input
                type="color"
                name="lineColor"
                value={component.props.lineColors?.[dataKey] || '#8884d8'}
                onChange={(e) => handleChange({
                  target: {
                    name: 'lineColor',
                    value: `${dataKey}|${e.target.value}`
                  }
                })}
                className="mt-1 block w-full"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Width</label>
            <input
              type="number"
              name="lineWidth"
              value={component.props.lineWidth || 2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Point Size</label>
            <input
              type="number"
              name="dataPointSize"
              value={component.props.dataPointSize || 5}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      )}

      {component.props.chartType === 'bar' && (
        <>
          <h4 className="text-md font-medium text-gray-900 mt-2">Bar Customization</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bar Color</label>
            <input
              type="color"
              name="barColor"
              value={component.props.barColor || '#8884d8'}
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
              value={component.props.barOpacity || 1}
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
          checked={component.props.showLegend || false}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      {component.props.showLegend && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Legend Position</label>
          <div className="flex justify-center space-x-2">
            {legendPositionIcons.map(({ position, icon: Icon, tooltip }) => (
              <button
                key={position}
                onClick={() => handleChange({ target: { name: 'legendPosition', value: position } })}
                className={`p-2 rounded-md ${
                  component.props.legendPosition === position
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

      {/* Axis Labels */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Axis Labels</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">X-Axis Label</label>
        <input
          type="text"
          name="xAxisLabel"
          value={component.props.xAxisLabel || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Y-Axis Label</label>
        <input
          type="text"
          name="yAxisLabel"
          value={component.props.yAxisLabel || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Axis Angles */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Axis Tick Angles</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">X-Axis Angle</label>
        <input
          type="number"
          name="xAxisAngle"
          value={component.props.xAxisAngle || 0}
          onChange={handleChange}
          min="-90"
          max="90"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Y-Axis Angle</label>
        <input
          type="number"
          name="yAxisAngle"
          value={component.props.yAxisAngle || 0}
          onChange={handleChange}
          min="-90"
          max="90"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Data Type and Formatting */}
      <h4 className="text-md font-medium text-gray-900 mt-2">Data Type and Formatting</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700">X-Axis Data Type</label>
        <select
          name="xAxisDataType"
          value={component.props.xAxisDataType || 'category'}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="category">Category</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
      </div>
      {component.props.xAxisDataType === 'date' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Format</label>
          <input
            type="text"
            name="dateFormat"
            value={component.props.dateFormat || 'MM/dd/yyyy'}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Y-Axis Data Type</label>
        <select
          name="yAxisDataType"
          value={component.props.yAxisDataType || 'number'}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="number">Number</option>
          <option value="category">Category</option>
        </select>
      </div>
      {component.props.yAxisDataType === 'number' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Number Format</label>
          <input
            type="text"
            name="numberFormat"
            value={component.props.numberFormat || '0,0.[00]'}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

    </div>
  );
};

export default ReChartControls;