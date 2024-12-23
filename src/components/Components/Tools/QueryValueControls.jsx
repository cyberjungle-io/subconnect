import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries, fetchWebServices } from '../../../w3s/w3sSlice';
import { executeQuery } from '../../../features/graphQLSlice';
import { WebServiceExecutor } from '../../../services/webService';

const QueryValueControls = ({ props, onPropsChange }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const webServices = useSelector(state => state.w3s.webServices?.list || []);
  const queriesStatus = useSelector(state => state.w3s.queries.status);
  const webServicesStatus = useSelector(state => state.w3s.webServices?.status);
  const [queryResult, setQueryResult] = useState(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [dataSource, setDataSource] = useState(props.queryId ? 'query' : props.webServiceId ? 'webservice' : '');

  useEffect(() => {
    if (queriesStatus === 'idle') {
      dispatch(fetchQueries());
    }
    if (webServicesStatus === 'idle') {
      dispatch(fetchWebServices());
    }
  }, [dispatch, queriesStatus, webServicesStatus]);

  useEffect(() => {
    if (props.queryId || props.webServiceId) {
      setIsRunningQuery(true);
      if (props.queryId) {
        const selectedQuery = queries.find(query => query._id === props.queryId);
        if (selectedQuery) {
          dispatch(executeQuery({ endpoint: selectedQuery.endpoint, query: selectedQuery.queryString }))
            .then((action) => {
              if (action.payload && action.payload.data) {
                setQueryResult(action.payload.data);
              }
            })
            .finally(() => setIsRunningQuery(false));
        }
      } else if (props.webServiceId) {
        const selectedService = webServices.find(service => service._id === props.webServiceId);
        if (selectedService) {
          WebServiceExecutor.execute(selectedService)
            .then(result => {
              setQueryResult(result);
            })
            .finally(() => setIsRunningQuery(false));
        }
      }
    }
  }, [dispatch, props.queryId, props.webServiceId, queries, webServices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dataSource') {
      setDataSource(value);
      onPropsChange({ 
        ...props, 
        queryId: '', 
        webServiceId: '', 
        field: '' 
      });
      setQueryResult(null);
    } else if (name === 'queryId') {
      onPropsChange({ 
        ...props, 
        queryId: value, 
        webServiceId: '', 
        field: '' 
      });
      setQueryResult(null);
    } else if (name === 'webServiceId') {
      onPropsChange({ 
        ...props, 
        webServiceId: value, 
        queryId: '', 
        field: '' 
      });
      setQueryResult(null);
    } else if (name === 'field') {
      onPropsChange({ ...props, [name]: value });
      if (queryResult && value) {
        let result = queryResult;
        value.split('.').forEach(key => {
          result = result && result[key];
        });
        if (Array.isArray(result) && result.length > 0) {
          result = result[0];
        }
        setQueryResult(result);
      }
    } else {
      onPropsChange({ ...props, [name]: value });
    }
  };

  if (queriesStatus === 'loading') {
    return <div>Loading queries...</div>;
  }

  if (queriesStatus === 'failed') {
    return <div>Error loading queries. Please try again.</div>;
  }

  const selectedQuery = queries.find(query => query._id === props.queryId);
  const selectedService = webServices.find(service => service._id === props.webServiceId);

  return (
    <div className="query-value-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Query Value Controls</h3>
      <div className="control-section-content">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source:
            <select
              name="dataSource"
              value={dataSource}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a data source</option>
              <option value="query">GraphQL Query</option>
              <option value="webservice">Web Service</option>
            </select>
          </label>
        </div>

        {dataSource === 'query' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Query:
              <select
                name="queryId"
                value={props.queryId || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a query</option>
                {queries.map(query => (
                  <option key={query._id} value={query._id}>{query.name}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {dataSource === 'webservice' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Web Service:
              <select
                name="webServiceId"
                value={props.webServiceId || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a web service</option>
                {webServices.map(service => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {(selectedQuery || selectedService) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Field:
              <select
                name="field"
                value={props.field || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a field</option>
                {selectedQuery && selectedQuery.fields.map(field => (
                  <option key={field._id} value={field.name}>{field.name}</option>
                ))}
                {selectedService && selectedService.dataMapping.fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {isRunningQuery && <div>Running query...</div>}
        {!isRunningQuery && queryResult !== null && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Query Result:</label>
            <div className="max-h-[150px] overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {typeof queryResult === 'object' ? JSON.stringify(queryResult, null, 2) : queryResult}
              </pre>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prefix:
            <input
              type="text"
              name="prefix"
              value={props.prefix || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="e.g. $"
            />
          </label>
          <input
            type="color"
            name="prefixColor"
            value={props.prefixColor || '#000000'}
            onChange={handleChange}
            className="mt-1 block"
          />
          <input
            type="number"
            name="prefixSize"
            value={props.prefixSize || 14}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholder="Font size (px)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suffix:
            <input
              type="text"
              name="suffix"
              value={props.suffix || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="e.g. USD"
            />
          </label>
          <input
            type="color"
            name="suffixColor"
            value={props.suffixColor || '#000000'}
            onChange={handleChange}
            className="mt-1 block"
          />
          <input
            type="number"
            name="suffixSize"
            value={props.suffixSize || 14}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholder="Font size (px)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <input
              type="checkbox"
              name="isPercentage"
              checked={props.isPercentage || false}
              onChange={(e) => handleChange({ target: { name: 'isPercentage', value: e.target.checked } })}
              className="mr-2"
            />
            Display as Percentage
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <input
              type="checkbox"
              name="useCommas"
              checked={props.useCommas || false}
              onChange={(e) => handleChange({ target: { name: 'useCommas', value: e.target.checked } })}
              className="mr-2"
            />
            Use Comma Separation
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suffix Position:
            <select
              name="suffixPosition"
              value={props.suffixPosition || 'middle'}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decimal Places:
            <input
              type="number"
              name="decimalPlaces"
              value={props.decimalPlaces || 0}
              onChange={handleChange}
              min="0"
              max="20"
              className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default QueryValueControls;