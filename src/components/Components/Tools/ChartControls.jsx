import React, { useState, useEffect, useCallback } from 'react';
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
  const [availableFields, setAvailableFields] = useState([]);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const queryLoading = useSelector(state => state.graphQL.queryLoading);
  const queryError = useSelector(state => state.graphQL.queryError);

  const [chartData, setChartData] = useState([]);

  const memoizedOnPropsChange = useCallback((newProps) => {
    onPropsChange(newProps);
  }, [onPropsChange]);

  useEffect(() => {
    if (props?.selectedQueryId) {
      const query = queries.find(q => q._id === props.selectedQueryId);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields);
      }
    }
  }, [props?.selectedQueryId, queries]);

  useEffect(() => {
    if (selectedQuery && props.dataKeys?.length > 0 && props.nameKey) {
      dispatch(executeQuery({
        endpoint: selectedQuery.endpoint,
        query: selectedQuery.queryString
      }));
    }
  }, [selectedQuery, props.dataKeys, props.nameKey, dispatch]);

  useEffect(() => {
    if (queryResult && !queryLoading && !queryError) {
      const dataKey = Object.keys(queryResult.data)[0];
      const newChartData = queryResult.data[dataKey];
      setChartData(newChartData);
    }
  }, [queryResult, queryLoading, queryError]);

  useEffect(() => {
    if (chartData.length > 0 && JSON.stringify(chartData) !== JSON.stringify(props.data)) {
      memoizedOnPropsChange({
        ...props,
        data: chartData,
        key: Date.now()
      });
    }
  }, [chartData, memoizedOnPropsChange, props]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'dataKeys') {
      newValue = Array.from(e.target.selectedOptions, option => option.value);
    }

    if (name === 'showDataPoints') {
      newValue = checked;
    }

    const updatedProps = {
      ...props,
      [name]: newValue
    };

    if (name === 'chartType') {
      updatedProps.key = Date.now();
    }

    memoizedOnPropsChange(updatedProps);
  }, [props, memoizedOnPropsChange]);

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
            name="showDataPoints"
            checked={props?.showDataPoints !== false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Show Data Points</span>
        </label>
      </div>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="showXAxis"
            checked={props?.showXAxis !== false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Show X Axis</span>
        </label>
      </div>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="showYAxis"
            checked={props?.showYAxis !== false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Show Y Axis</span>
        </label>
      </div>
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
    </>
  );

  return (
    <div className="chart-controls">
      {renderSection("General", "general", generalContent)}
      {renderSection("Styling", "styling", stylingContent)}
      {renderSection("Advanced", "advanced", advancedContent)}
    </div>
  );
};

export default ChartControls;