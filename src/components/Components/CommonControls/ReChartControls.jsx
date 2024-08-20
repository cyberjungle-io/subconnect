import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueries } from '../../../w3s/w3sSlice';
import { executeQuery } from '../../../features/graphQLSlice';
import { FaChevronUp, FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import ColorPicker from '../../common/ColorPicker';

const ReChartControls = ({ component, onUpdate }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const queriesStatus = useSelector(state => state.w3s.queries.status);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    dataSource: false,
    styling: false,
    advanced: false,
  });

  useEffect(() => {
    dispatch(fetchQueries());
  }, [dispatch]);

  useEffect(() => {
    if (component.props.selectedQueryId) {
      const query = queries.find(q => q._id === component.props.selectedQueryId);
      setSelectedQuery(query);
      if (query && query.fields) {
        setAvailableFields(query.fields.map(field => ({
          ...field,
          name: field.name.split('.').pop()
        })));
      }
    }
  }, [component.props.selectedQueryId, queries]);

  useEffect(() => {
    if (queryResult && queryResult.parsedData) {
      setChartData(queryResult.parsedData);
    }
  }, [queryResult]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'dataKeys') {
      newValue = Array.from(e.target.selectedOptions, option => option.value);
    }

    const updatedProps = {
      ...component.props,
      [name]: newValue
    };

    if (name === 'chartType') {
      updatedProps.key = Date.now();
    }

    onUpdate({ props: updatedProps });

    if ((name === 'dataKeys' || name === 'nameKey') && selectedQuery) {
      if (updatedProps.dataKeys.length > 0 && updatedProps.nameKey) {
        try {
          const result = await dispatch(executeQuery({
            endpoint: selectedQuery.endpoint,
            query: selectedQuery.queryString
          })).unwrap();
          
          if (result.data) {
            const dataKey = Object.keys(result.data)[0];
            const newChartData = result.data[dataKey];
            setChartData(newChartData);
            
            onUpdate({
              props: {
                ...updatedProps,
                data: newChartData,
                key: Date.now()
              }
            });
          }
        } catch (error) {
          console.error('Error executing query:', error);
        }
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (title, sectionKey, content) => (
    <div className="control-section">
      <div
        className="control-section-header"
        onClick={() => toggleSection(sectionKey)}
      >
        {expandedSections[sectionKey] ? <FaChevronDown /> : <FaChevronRight />}
        <span className="control-section-title">{title}</span>
      </div>
      {expandedSections[sectionKey] && (
        <div className="control-section-content">
          {content}
        </div>
      )}
    </div>
  );

  const generalContent = (
    <>
      <div className="mb-2">
        <label className="control-label">Chart Type</label>
        <select
          name="chartType"
          value={component.props.chartType || 'line'}
          onChange={handleChange}
          className="control-select"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="area">Area Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="control-label">Chart Title</label>
        <input
          type="text"
          name="title"
          value={component.props.title || ''}
          onChange={handleChange}
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Chart Width</label>
        <input
          type="number"
          name="width"
          value={component.props.width || 500}
          onChange={handleChange}
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Chart Height</label>
        <input
          type="number"
          name="height"
          value={component.props.height || 300}
          onChange={handleChange}
          className="control-input"
        />
      </div>
    </>
  );

  const dataSourceContent = (
    <>
      <div className="mb-2">
        <label className="control-label">Select Query</label>
        <select
          name="selectedQueryId"
          value={component.props.selectedQueryId || ''}
          onChange={handleChange}
          className="control-select"
        >
          <option value="">Select a query</option>
          {queries.map(query => (
            <option key={query._id} value={query._id}>{query.name}</option>
          ))}
        </select>
      </div>
      {queriesStatus === 'loading' && <p>Loading queries...</p>}
      {queriesStatus === 'failed' && <p>Failed to load queries</p>}
      {queriesStatus === 'succeeded' && queries.length === 0 && <p>No queries available</p>}
      {selectedQuery && (
        <>
          <div className="mb-2">
            <label className="control-label">Data Keys (Y-axis)</label>
            <select
              multiple
              name="dataKeys"
              value={component.props.dataKeys || []}
              onChange={handleChange}
              className="control-select"
            >
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="control-label">Name Key (X-axis)</label>
            <select
              name="nameKey"
              value={component.props.nameKey || ''}
              onChange={handleChange}
              className="control-select"
            >
              <option value="">Select a field</option>
              {availableFields.map(field => (
                <option key={field._id} value={field.name}>{field.name}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );

  const stylingContent = (
    <>
      <div className="mb-2">
        <label className="control-label">Title Font Size</label>
        <input
          type="number"
          name="titleFontSize"
          value={component.props.titleFontSize || 16}
          onChange={handleChange}
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Title Color</label>
        <ColorPicker
          color={component.props.titleColor || '#000000'}
          onChange={(color) => handleChange({ target: { name: 'titleColor', value: color } })}
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Title Alignment</label>
        <select
          name="titleAlign"
          value={component.props.titleAlign || 'center'}
          onChange={handleChange}
          className="control-select"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      {component.props.chartType === 'line' && (
        <>
          <div className="mb-2">
            <label className="control-label">Line Color</label>
            <ColorPicker
              color={component.props.lineColor || '#8884d8'}
              onChange={(color) => handleChange({ target: { name: 'lineColor', value: color } })}
            />
          </div>
          <div className="mb-2">
            <label className="control-label">Line Width</label>
            <input
              type="number"
              name="lineWidth"
              value={component.props.lineWidth || 2}
              onChange={handleChange}
              className="control-input"
            />
          </div>
        </>
      )}
      {component.props.chartType === 'bar' && (
        <>
          <div className="mb-2">
            <label className="control-label">Bar Color</label>
            <ColorPicker
              color={component.props.barColor || '#8884d8'}
              onChange={(color) => handleChange({ target: { name: 'barColor', value: color } })}
            />
          </div>
          <div className="mb-2">
            <label className="control-label">Bar Opacity</label>
            <input
              type="number"
              name="barOpacity"
              min="0"
              max="1"
              step="0.1"
              value={component.props.barOpacity || 1}
              onChange={handleChange}
              className="control-input"
            />
          </div>
        </>
      )}
    </>
  );

  const advancedContent = (
    <>
      <div className="mb-2">
        <label className="control-label">Show Legend</label>
        <input
          type="checkbox"
          name="showLegend"
          checked={component.props.showLegend || false}
          onChange={handleChange}
        />
      </div>
      {component.props.showLegend && (
        <div className="mb-2">
          <label className="control-label">Legend Position</label>
          <div className="control-button-group">
            {['top', 'right', 'bottom', 'left'].map(position => (
              <button
                key={position}
                onClick={() => handleChange({ target: { name: 'legendPosition', value: position } })}
                className={`control-button ${component.props.legendPosition === position ? 'active' : ''}`}
                title={position.charAt(0).toUpperCase() + position.slice(1)}
              >
                {position === 'top' && <FaChevronUp />}
                {position === 'right' && <FaChevronRight />}
                {position === 'bottom' && <FaChevronDown />}
                {position === 'left' && <FaChevronLeft />}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-2">
        <label className="control-label">X-Axis Label</label>
        <input
          type="text"
          name="xAxisLabel"
          value={component.props.xAxisLabel || ''}
          onChange={handleChange}
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Y-Axis Label</label>
        <input
          type="text"
          name="yAxisLabel"
          value={component.props.yAxisLabel || ''}
          onChange={handleChange}
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">X-Axis Angle</label>
        <input
          type="number"
          name="xAxisAngle"
          value={component.props.xAxisAngle || 0}
          onChange={handleChange}
          min="-90"
          max="90"
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Y-Axis Angle</label>
        <input
          type="number"
          name="yAxisAngle"
          value={component.props.yAxisAngle || 0}
          onChange={handleChange}
          min="-90"
          max="90"
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Date Format</label>
        <input
          type="text"
          name="dateFormat"
          value={component.props.dateFormat || ''}
          onChange={handleChange}
          className="control-input"
          placeholder="e.g., YYYY-MM-DD"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={component.props.startDate || ''}
          onChange={handleChange}
          className="control-input"
        />
      </div>
      <div className="mb-2">
        <label className="control-label">End Date</label>
        <input
          type="date"
          name="endDate"
          value={component.props.endDate || ''}
          onChange={handleChange}
          className="control-input"
        />
      </div>
    </>
  );

  return (
    <div className="chart-controls">
      {renderSection("General", "general", generalContent)}
      {renderSection("Data Source", "dataSource", dataSourceContent)}
      {renderSection("Styling", "styling", stylingContent)}
      {renderSection("Advanced", "advanced", advancedContent)}
    </div>
  );
};

export default ReChartControls;