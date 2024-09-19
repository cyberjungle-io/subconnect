import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';
import { fetchQueries } from '../../../w3s/w3sSlice';

const QueryValueRenderer = ({ component }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = useSelector(state => state.w3s.queries.list.find(q => q._id === component.props.queryId));

  useEffect(() => {
    if (component.props.queryId) {
      if (!query) {
        dispatch(fetchQueries()).then(() => {
          executeQueryAndSetValue();
        });
      } else {
        executeQueryAndSetValue();
      }
    }
  }, [dispatch, component.props.queryId, component.props.field, query]);

  const executeQueryAndSetValue = () => {
    if (query) {
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
                  result = result[0];
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
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "No data available";
    }

    let formattedValue = value;

    // Handle object or array values
    if (typeof value === 'object') {
      formattedValue = JSON.stringify(value);
      return formattedValue;
    }

    // Convert to number if possible
    if (!isNaN(value)) {
      formattedValue = Number(value);

      // Convert to percentage if needed
      if (component.props.isPercentage) {
        formattedValue *= 100;
      }

      // Apply decimal places
      if (component.props.decimalPlaces !== undefined) {
        formattedValue = formattedValue.toFixed(component.props.decimalPlaces);
      }

      // Apply comma separation
      if (component.props.useCommas) {
        formattedValue = Number(formattedValue).toLocaleString();
      }

      // Add percentage sign if needed
      if (component.props.isPercentage) {
        formattedValue += '%';
      }
    }

    const prefixStyle = {
      color: component.props.prefixColor || 'inherit',
      fontSize: `${component.props.prefixSize || 14}px`,
    };

    const suffixStyle = {
      color: component.props.suffixColor || 'inherit',
      fontSize: `${component.props.suffixSize || 14}px`,
    };

    const suffixPosition = component.props.suffixPosition || 'middle';

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {component.props.prefix && <span style={prefixStyle}>{component.props.prefix}</span>}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span>{formattedValue}</span>
          {component.props.suffix && (
            <span 
              style={{
                ...suffixStyle,
                position: 'absolute',
                left: '100%',
                marginLeft: '4px',
                ...(suffixPosition === 'top' && { top: '25%', transform: 'translateY(-100%)' }),
                ...(suffixPosition === 'middle' && { top: '50%', transform: 'translateY(-50%)' }),
                ...(suffixPosition === 'bottom' && { bottom: '25%', transform: 'translateY(100%)' }),
              }}
            >
              {component.props.suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return "Loading...";
    }
    if (error) {
      return `Error: ${error}`;
    }
    return formatValue(value);
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