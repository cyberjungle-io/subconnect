import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries } from '../../../w3s/w3sSlice'; // Adjust the import path as needed

const QueryValueControls = ({ style, props, content, onStyleChange, onPropsChange, onContentChange }) => {
  const dispatch = useDispatch();
  const queries = useSelector(state => state.w3s.queries.list);
  const queriesStatus = useSelector(state => state.w3s.queries.status);

  useEffect(() => {
    if (queriesStatus === 'idle') {
      dispatch(fetchQueries());
    }
  }, [dispatch, queriesStatus]);

  console.log('QueryValueControls rendered with props:', { style, props, content });
  console.log('Available queries:', queries);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onPropsChange({ ...props, [name]: value });
  };

  if (queriesStatus === 'loading') {
    return <div>Loading queries...</div>;
  }

  if (queriesStatus === 'failed') {
    return <div>Error loading queries. Please try again.</div>;
  }

  return (
    <div>
      <h3>Query Value Controls</h3>
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