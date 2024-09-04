import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';

const ChartControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    dataSource: false,
    styling: false,
    advanced: false,
  });

  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s?.queries?.list ?? []);
  const queriesStatus = useSelector(state => state.w3s?.queries?.status ?? 'idle');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    if (props?.selectedQueryId) {
      const query = queries.find(q => q._id === props.selectedQueryId);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields);
      }
    }
  }, [props?.selectedQueryId, queries]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'dataKeys') {
      newValue = Array.from(e.target.selectedOptions, option => option.value);
    }

    const updatedProps = {
      ...props,
      [name]: newValue
    };

    if (name === 'chartType') {
      updatedProps.key = Date.now();
    }

    onPropsChange(updatedProps);

    if ((name === 'dataKeys' || name === 'nameKey') && selectedQuery) {
      if (updatedProps.dataKeys?.length > 0 && updatedProps.nameKey) {
        try {
          const result = await dispatch(executeQuery({
            endpoint: selectedQuery.endpoint,
            query: selectedQuery.queryString
          })).unwrap();
          
          if (result.data) {
            const dataKey = Object.keys(result.data)[0];
            const newChartData = result.data[dataKey];
            setChartData(newChartData);
            
            onPropsChange({
              ...updatedProps,
              data: newChartData,
              key: Date.now()
            });
          }
        } catch (error) {
          console.error('Error executing query:', error);
        }
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (title, sectionKey, content) => (
    <div className="control-section mb-4">
      <div
        className="control-section-header flex items-center cursor-pointer"
        onClick={() => toggleSection(sectionKey)}
      >
        {expandedSections[sectionKey] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
        <span className="control-section-title text-sm font-medium text-gray-700">{title}</span>
      </div>
      {expandedSections[sectionKey] && (
        <div className="control-section-content mt-2">
          {content}
        </div>
      )}
    </div>
  );

  const generalContent = (
    <>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
        <select
          name="chartType"
          value={props?.chartType || 'line'}
          onChange={handleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="area">Area Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
        <input
          type="text"
          name="title"
          value={props?.title || ''}
          onChange={handleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </>
  );

  const dataSourceContent = (
    <>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Query</label>
        <select
          name="selectedQueryId"
          value={props?.selectedQueryId || ''}
          onChange={handleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
      {selectedQuery && (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Keys (Y-axis)</label>
            <select
              multiple
              name="dataKeys"
              value={props?.dataKeys || []}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name Key (X-axis)</label>
            <select
              name="nameKey"
              value={props?.nameKey || ''}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a field</option>
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );

  const stylingContent = (
    <>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title Font Size</label>
        <input
          type="number"
          name="titleFontSize"
          value={props?.titleFontSize || 16}
          onChange={handleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title Color</label>
        <ColorPicker
          color={props?.titleColor || '#000000'}
          onChange={(color) => onPropsChange({ ...props, titleColor: color })}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title Alignment</label>
        <select
          name="titleAlign"
          value={props?.titleAlign || 'center'}
          onChange={handleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </>
  );

  const advancedContent = (
    <>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="showLegend"
            checked={props?.showLegend || false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Show Legend</span>
        </label>
      </div>
      {props?.showLegend && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Legend Position</label>
          <select
            name="legendPosition"
            value={props?.legendPosition || 'bottom'}
            onChange={handleChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="top">Top</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
          </select>
        </div>
      )}
    </>
  );

  return (
    <div className="chart-controls">
      {renderSection("General", "general", generalContent)}
      {renderSection("Data Source", "dataSource", dataSourceContent)}
      {renderSection("Styling", "styling", stylingContent)}
      {renderSection("Advanced", "advanced", advancedContent)}
    </div>
  );
};

export default ChartControls;