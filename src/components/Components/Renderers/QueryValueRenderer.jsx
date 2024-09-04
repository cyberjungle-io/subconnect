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
    alignItems: component.style.alignItems || 'flex-start',
    justifyContent: component.style.justifyContent || 'flex-start',
    padding: '10px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    // Apply text styles
    fontFamily: component.style.fontFamily || 'Arial, sans-serif',
    fontSize: component.style.fontSize || '14px',
    fontWeight: component.style.fontWeight || 'normal',
    fontStyle: component.style.fontStyle || 'normal',
    textDecoration: component.style.textDecoration || 'none',
    color: component.style.color || '#333',
    textAlign: component.style.textAlign || 'left',
    lineHeight: component.style.lineHeight || 'normal',
    letterSpacing: component.style.letterSpacing || 'normal',
    textTransform: component.style.textTransform || 'none',
    textShadow: component.style.textShadow || 'none',
  };

  // Apply background styles
  if (component.style.backgroundColor) {
    labelStyle.backgroundColor = component.style.backgroundColor;
  }
  if (component.style.backgroundImage) {
    labelStyle.backgroundImage = component.style.backgroundImage;
    labelStyle.backgroundSize = 'cover';
    labelStyle.backgroundPosition = 'center';
    labelStyle.backgroundRepeat = 'no-repeat';
  }

  return (
    <div className="query-value-renderer" style={labelStyle}>
      {renderContent()}
    </div>
  );
};

export default QueryValueRenderer;