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
              const fieldPath = component.props.field.split('.');
              for (let i = 0; i < fieldPath.length; i++) {
                const key = fieldPath[i];
                if (Array.isArray(result)) {
                  result = result[0]; // Always take the first element of an array
                }
                if (result && typeof result === 'object') {
                  result = result[key];
                } else {
                  result = undefined;
                  break;
                }
              }
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

  const renderContent = () => {
    if (loading) {
      return "Loading...";
    }
    if (error) {
      return `Error: ${error}`;
    }
    if (value === null || value === undefined) {
      return "No data available";
    }
    return `${value}`;
  };

  const labelStyle = {
    ...component.style,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f8f8f8',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#333',
    width: '100%',  // Add this line
    height: '100%', // Add this line
    boxSizing: 'border-box', // Add this line
  };

  return (
    <div className="query-value-renderer" style={labelStyle}>
      {renderContent()}
    </div>
  );
};

export default QueryValueRenderer;