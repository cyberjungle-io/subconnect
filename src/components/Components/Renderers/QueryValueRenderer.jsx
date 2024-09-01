import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuery } from '../../../w3s/w3sSlice';

const QueryValueRenderer = ({ component }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = useSelector(state => state.w3s.queries.list.find(q => q._id === component.props.queryId));

  useEffect(() => {
    if (component.props.queryId) {
      setLoading(true);
      setError(null);
      dispatch(fetchQuery(component.props.queryId))
        .then(() => setLoading(false))
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [dispatch, component.props.queryId]);

  useEffect(() => {
    if (query && query.result) {
      try {
        let result = query.result;
        if (Array.isArray(result) && component.props.field) {
          result = result.map(item => item[component.props.field]);
        }
        setValue(Array.isArray(result) ? result[0] : result);
      } catch (err) {
        setError('Error processing query result');
      }
    }
  }, [query, component.props]);

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
}

export default QueryValueRenderer;