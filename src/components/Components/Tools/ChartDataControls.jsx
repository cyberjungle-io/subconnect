import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';

const ChartDataControls = ({ props, onPropsChange }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s?.queries?.list ?? []);
  const queriesStatus = useSelector(state => state.w3s?.queries?.status ?? 'idle');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const queryLoading = useSelector(state => state.graphQL.queryLoading);
  const queryError = useSelector(state => state.graphQL.queryError);

  const [chartData, setChartData] = useState([]);

  const handleChange = (key, value) => {
    onPropsChange({ [key]: value });
  };

  const handleSeriesNameChange = (dataKey, newName) => {
    const updatedSeriesNames = { ...(props.seriesNames || {}), [dataKey]: newName };
    onPropsChange({ ...props, seriesNames: updatedSeriesNames });
  };

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
    if (queryResult && queryResult.data && !queryLoading && !queryError) {
      const dataKeys = Object.keys(queryResult.data);
      if (dataKeys.length > 0) {
        const dataKey = dataKeys[0];
        const newChartData = queryResult.data[dataKey];
        setChartData(newChartData);
      }
    }
  }, [queryResult, queryLoading, queryError]);

  useEffect(() => {
    if (chartData.length > 0 && JSON.stringify(chartData) !== JSON.stringify(props.data)) {
      onPropsChange({
        ...props,
        data: chartData,
        key: Date.now()
      });
    }
  }, [chartData, onPropsChange, props]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Chart Type</label>
        <select
          value={props.chartType || 'line'}
          onChange={(e) => handleChange('chartType', e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Query</label>
        <select
          name="selectedQueryId"
          value={props?.selectedQueryId || ''}
          onChange={(e) => handleChange('selectedQueryId', e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a query</option>
          {queries.map(query => (
            <option key={query._id} value={query._id}>{query.name}</option>
          ))}
        </select>
      </div>
      {selectedQuery && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Keys (Y-axis)</label>
            <select
              multiple
              name="dataKeys"
              value={props?.dataKeys || []}
              onChange={(e) => handleChange('dataKeys', Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              value={props?.nameKey || ''}
              onChange={(e) => handleChange('nameKey', e.target.value)}
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
      {selectedQuery && props.dataKeys && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Series Names</label>
          {props.dataKeys.map((dataKey) => (
            <div key={dataKey} className="mt-2">
              <label className="block text-xs text-gray-500">{dataKey}</label>
              <input
                type="text"
                value={props.seriesNames?.[dataKey] || dataKey}
                onChange={(e) => handleSeriesNameChange(dataKey, e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      )}
 
    </div>
  );
};

export default ChartDataControls;
