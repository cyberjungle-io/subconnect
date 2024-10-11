import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';

const TableDataControls = ({ props, onPropsChange }) => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const queryLoading = useSelector(state => state.graphQL.queryLoading);
  const queryError = useSelector(state => state.graphQL.queryError);

  const [tableData, setTableData] = useState([]);

  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s?.queries?.list ?? []);

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
    if (selectedQuery && props.columns?.length > 0) {
      dispatch(executeQuery({
        endpoint: selectedQuery.endpoint,
        query: selectedQuery.queryString
      }));
    }
  }, [selectedQuery, props.columns, dispatch]);

  useEffect(() => {
    if (queryResult && !queryLoading && !queryError) {
      const dataKey = Object.keys(queryResult.data)[0];
      const newTableData = queryResult.data[dataKey];
      setTableData(newTableData);
    }
  }, [queryResult, queryLoading, queryError]);

  useEffect(() => {
    if (tableData.length > 0 && JSON.stringify(tableData) !== JSON.stringify(props.data)) {
      onPropsChange({
        ...props,
        data: tableData,
        key: Date.now()
      });
    }
  }, [tableData, onPropsChange, props]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'columns') {
      newValue = Array.from(e.target.selectedOptions, option => ({
        key: option.value,
        label: option.value,
        type: 'string'
      }));
    }

    onPropsChange({ ...props, [name]: newValue });
  }, [props, onPropsChange]);

  const handleSeriesNameChange = (dataKey, newName) => {
    const updatedSeriesNames = { ...(props.seriesNames || {}), [dataKey]: newName };
    onPropsChange({ ...props, seriesNames: updatedSeriesNames });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Query</label>
        <select
          name="selectedQueryId"
          value={props?.selectedQueryId || ''}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
            <label className="block text-sm font-medium text-gray-700">Select Columns</label>
            <select
              multiple
              name="columns"
              value={props?.columns?.map(col => col.key) || []}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
          {props.columns && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Column Names</label>
              {props.columns.map((column) => (
                <div key={column.key} className="mt-2">
                  <label className="block text-xs text-gray-500">{column.key}</label>
                  <input
                    type="text"
                    value={props.seriesNames?.[column.key] || column.key}
                    onChange={(e) => handleSeriesNameChange(column.key, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableDataControls;
