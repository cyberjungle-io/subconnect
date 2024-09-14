import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries } from '../../../w3s/w3sSlice';
import { executeQuery } from '../../../features/graphQLSlice';

const QueryValueControls = ({ props, onPropsChange }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const queriesStatus = useSelector(state => state.w3s.queries.status);
  const [queryResult, setQueryResult] = useState(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);

  useEffect(() => {
    if (queriesStatus === 'idle') {
      dispatch(fetchQueries());
    }
  }, [dispatch, queriesStatus]);

  useEffect(() => {
    if (props.queryId && props.field) {
      setIsRunningQuery(true);
      const selectedQuery = queries.find(query => query._id === props.queryId);
      if (selectedQuery) {
        dispatch(executeQuery({ endpoint: selectedQuery.endpoint, query: selectedQuery.queryString }))
          .then((action) => {
            if (action.payload && action.payload.data) {
              let result = action.payload.data;
              props.field.split('.').forEach(key => {
                result = result && result[key];
              });
              if (Array.isArray(result) && result.length > 0) {
                result = result[0];
              }
              setQueryResult(result);
            }
          })
          .finally(() => setIsRunningQuery(false));
      }
    }
  }, [dispatch, props.queryId, props.field, queries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'queryId') {
      onPropsChange({ ...props, queryId: value, field: '' });
      setQueryResult(null);
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

  return (
    <div className="query-value-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Query Value Controls</h3>
      <div className="control-section-content">
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
        {selectedQuery && (
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
                {selectedQuery.fields.map(field => (
                  <option key={field._id} value={field.name}>{field.name}</option>
                ))}
              </select>
            </label>
          </div>
        )}
        {isRunningQuery && <div>Running query...</div>}
        {!isRunningQuery && queryResult !== null && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Query Result:</label>
            <span className="text-sm text-gray-600">{JSON.stringify(queryResult)}</span>
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