import React, { useState, useEffect, useCallback } from 'react';
import ColorPicker from '../../common/ColorPicker';
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';
import { format } from 'date-fns';

const ChartControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const queryLoading = useSelector(state => state.graphQL.queryLoading);
  const queryError = useSelector(state => state.graphQL.queryError);

  const [chartData, setChartData] = useState([]);

  const memoizedOnPropsChange = useCallback((newProps) => {
    onPropsChange(newProps);
  }, [onPropsChange]);

  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s?.queries?.list ?? []);
  const queriesStatus = useSelector(state => state.w3s?.queries?.status ?? 'idle');

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

  const renderSection = (title, content) => (
    <div className="control-section mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="control-section-content">
        {content}
      </div>
    </div>
  );

  const titleContent = (
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

  const buttonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border flex-grow text-center";
  const activeButtonClass = `${buttonClass} bg-[#cce7ff] text-blue-700 border-blue-300`;
  const inactiveButtonClass = `${buttonClass} bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]`;

  const renderToggle = (label, name) => (
    <button
      onClick={() => handleChange({ target: { name, type: 'checkbox', checked: !props[name] } })}
      className={props[name] !== false ? activeButtonClass : inactiveButtonClass}
    >
      {label}
    </button>
  );

  const getContrastColor = (hexColor) => {
    // Add a check for undefined or invalid hexColor
    if (!hexColor || typeof hexColor !== 'string' || hexColor.length !== 7) {
      return '#000000'; // Default to black if the color is invalid
    }

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const chartElementsContent = (
    <div className="space-y-12">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {renderToggle("Data Points", "showDataPoints")}
          {renderToggle("Grid", "showGrid")}
          {renderToggle("Legend", "showLegend")}
        </div>
        <div className="flex gap-2 mb-4">
          {renderToggle("X Axis", "showXAxis")}
          {renderToggle("Y Axis", "showYAxis")}
        </div>
      </div>

      {props.showLegend !== false && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Legend</h3>
          <div className="mb-4">
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
        </div>
      )}

      {props.dataKeys && props.dataKeys.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Series</h3>
          {props.dataKeys.map((dataKey) => {
            const seriesColor = props.lineColors?.[dataKey] || props.colors?.[props.dataKeys.indexOf(dataKey) % (props.colors?.length || 1)] || '#000000';
            const textColor = getContrastColor(seriesColor);
            return (
              <div key={dataKey} className="mb-3">
                <label 
                  className="block text-sm font-semibold px-2 py-1 rounded mb-1"
                  style={{
                    backgroundColor: seriesColor,
                    color: textColor
                  }}
                >
                  {props.seriesNames?.[dataKey] || dataKey}
                </label>
                <ColorPicker
                  color={seriesColor}
                  onChange={(color) => handleSeriesColorChange(dataKey, color)}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Axis controls */}
      {(props.showXAxis !== false || props.showYAxis !== false) && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Axis</h3>
          
          {props.showXAxis !== false && (
            <>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">X Axis Data Type</label>
                <select
                  name="xAxisDataType"
                  value={props?.xAxisDataType || 'category'}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="category">Category</option>
                  <option value="date">Date</option>
                  <option value="number">Number</option>
                </select>
              </div>

              {props?.xAxisDataType === 'date' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <input
                    type="text"
                    name="dateFormat"
                    value={props?.dateFormat || 'MM/dd/yyyy'}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <small className="text-gray-500">e.g., MM/dd/yyyy, yyyy-MM-dd, dd MMM yyyy</small>
                </div>
              )}
            </>
          )}

          {(props.showXAxis !== false && props?.xAxisDataType === 'number') || (props.showYAxis !== false && props?.yAxisDataType === 'number') ? (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number Format</label>
              <input
                type="text"
                name="numberFormat"
                value={props?.numberFormat || '0,0.[00]'}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <small className="text-gray-500">e.g., 0,0.[00], $0,0.00, 0%</small>
            </div>
          ) : null}

          {props.showYAxis !== false && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Y Axis Data Type</label>
              <select
                name="yAxisDataType"
                value={props?.yAxisDataType || 'number'}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="number">Number</option>
                <option value="category">Category</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">Tooltip</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
          <ColorPicker
            color={props?.tooltipBackgroundColor || '#ffffff'}
            onChange={(color) => handleChange({ target: { name: 'tooltipBackgroundColor', value: color } })}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip Border Color</label>
          <ColorPicker
            color={props?.tooltipBorderColor || '#cccccc'}
            onChange={(color) => handleChange({ target: { name: 'tooltipBorderColor', value: color } })}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip Text Color</label>
          <ColorPicker
            color={props?.tooltipTextColor || '#000000'}
            onChange={(color) => handleChange({ target: { name: 'tooltipTextColor', value: color } })}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip Value Format</label>
          <input
            type="text"
            name="tooltipValueFormat"
            value={props?.tooltipValueFormat || '0,0.[00]'}
            onChange={handleChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <small className="text-gray-500">e.g., 0,0.[00], $0,0.00, 0%</small>
        </div>
      </div>
    </div>
  );

  const handleSeriesColorChange = (dataKey, color) => {
    const updatedLineColors = { ...(props.lineColors || {}), [dataKey]: color };
    memoizedOnPropsChange({ ...props, lineColors: updatedLineColors });
  };

  return (
    <div className="chart-controls space-y-12">
      {renderSection("Chart Elements", chartElementsContent)}
      {renderSection("Title", titleContent)}
    </div>
  );
};

export default ChartControls;