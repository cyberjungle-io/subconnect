import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';

const QueryValueRenderer = ({ component }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = useSelector(state => state.w3s.queries.list.find(q => q._id === component.props.queryId));

  useEffect(() => {
    if (component.props.queryId && query) {
      setLoading(true);
      setError(null);
      dispatch(executeQuery({ endpoint: query.endpoint, query: query.queryString }))
        .then((action) => {
          if (action.payload && action.payload.data) {
            let result = action.payload.data;
            if (component.props.field) {
              component.props.field.split('.').forEach(key => {
                result = result && result[key];
              });
            }
            if (Array.isArray(result) && result.length > 0) {
              result = result[0];
            }
            setValue(result);
          }
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, component.props.queryId, component.props.field, query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (value === null) {
    return <div>No data available</div>;
  }

  return (
    <div className="query-value-renderer" style={component.style}>
      {value}
    </div>
  );
};

export default QueryValueRenderer;