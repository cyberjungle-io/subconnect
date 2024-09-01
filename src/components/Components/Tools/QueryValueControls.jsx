import React from 'react';
import { useSelector } from 'react-redux';

const QueryValueControls = ({ component, onUpdate }) => {
  const queries = useSelector(state => state.w3s.queries.list);

  console.log('QueryValueControls received component:', component);

  if (!component || typeof component !== 'object') {
    console.error('Component is undefined or not an object in QueryValueControls');
    return null;
  }

  const props = component.props || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...component, props: { ...props, [name]: value } });
  };

  return (
    <div>
      <label>
        Select Query:
        <select
          name="queryId"
          value={props.queryId || ''}
          onChange={handleChange}
        >
          <option value="">Select a query</option>
          {queries.map(query => (
            <option key={query._id} value={query._id}>{query.name}</option>
          ))}
        </select>
      </label>
      <label>
        Select Field:
        <input
          type="text"
          name="field"
          value={props.field || ''}
          onChange={handleChange}
          placeholder="Enter field name"
        />
      </label>
    </div>
  );
};

export default QueryValueControls;