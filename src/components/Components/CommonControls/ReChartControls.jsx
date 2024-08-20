import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueries } from '../../../w3s/w3sSlice';
import { executeQuery } from '../../../features/graphQLSlice';
import { FaChevronUp, FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { componentConfig, componentTypes } from '../componentConfig';

const ReChartControls = ({ component, onUpdate }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const queriesStatus = useSelector(state => state.w3s.queries.status);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    dispatch(fetchQueries());
  }, [dispatch]);

  useEffect(() => {
    if (component.props.selectedQueryId) {
      const query = queries.find(q => q._id === component.props.selectedQueryId);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields);
      }
    }
  }, [component.props.selectedQueryId, queries]);

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
        setAvailableFields(query.fields);
        updatedProps.dataKeys = [];
        updatedProps.nameKey = '';
      }
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
          
          // Update the chart data in the parent component
          onUpdate({
            props: {
              ...updatedProps,
              data: result.data[Object.keys(result.data)[0]]
            }
          });
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
          {componentConfig[componentTypes.CHART].chartTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</option>
          ))}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Color</label>
            <input
              type="color"
              name="lineColor"
              value={component.props.lineColor || '#8884d8'}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
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

    </div>
  );
};

export default ReChartControls;