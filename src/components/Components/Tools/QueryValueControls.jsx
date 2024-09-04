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
      </div>
    </div>
  );
};

export default QueryValueControls;