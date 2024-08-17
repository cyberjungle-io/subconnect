import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries, createQuery, updateQuery, deleteQuery } from '../../w3s/w3sSlice';
import { setEndpoint, fetchGraphQLSchema, executeQuery } from '../../features/graphQLSlice';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const SchemaItem = ({ item, onSelect, selectedFields, depth = 0, path = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const getTypeName = (type) => {
    if (type.kind === 'NON_NULL') {
      return `${getTypeName(type.ofType)}!`;
    } else if (type.kind === 'LIST') {
      return `[${getTypeName(type.ofType)}]`;
    } else {
      return type.name;
    }
  };

  const currentPath = [...path, item.name];
  const isSelected = selectedFields.some(f => 
    f && Array.isArray(f.path) && f.path.join('.') === currentPath.join('.')
  );

  const isObject = item.fields && item.fields.length > 0;

  return (
    <li className="mt-2">
      <div className="flex items-center" style={{ marginLeft: `${depth * 20}px` }}>
        {isObject ? (
          <button onClick={toggleExpand} className="mr-2">
            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        ) : (
          <>
            <span className="mr-6"></span>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(currentPath, item.query_field)}
              className="mr-2"
            />
          </>
        )}
        <span className={`font-semibold ${isObject ? 'text-blue-600' : ''}`}>{item.name}</span>
        <span className="ml-2 text-gray-500">({item.kind})</span>
        {item.type && <span className="ml-2 text-gray-500">: {getTypeName(item.type)}</span>}
      </div>
      {isExpanded && isObject && (
        <ul className="ml-6 mt-1">
          {item.fields.map(field => (
            <SchemaItem
              key={field.name}
              item={{...field, query_field: item.query_field}}
              onSelect={onSelect}
              selectedFields={selectedFields}
              depth={depth + 1}
              path={currentPath}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const GraphQLQueryTab = () => {
  const dispatch = useDispatch();
  const { endpoint, schema, schemaLoading, schemaError, queryResult, queryLoading, queryError } = useSelector(state => state.graphQL);
  const { list: queries, status: queriesStatus, error: queriesError } = useSelector(state => state.w3s.queries);

  const [localSchema, setLocalSchema] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [queryLimit, setQueryLimit] = useState(10);
  const [editableQuery, setEditableQuery] = useState('');
  const [queryName, setQueryName] = useState('');
  const [currentQueryId, setCurrentQueryId] = useState(null);

  useEffect(() => {
    dispatch(fetchGraphQLSchema(endpoint));
    console.log('GraphQLQueryTab: Dispatching fetchQueries'); // Log 10
    dispatch(fetchQueries())
      .then((result) => {
        console.log('GraphQLQueryTab: fetchQueries result', result); // Log 11
      })
      .catch((error) => {
        console.error('GraphQLQueryTab: fetchQueries error', error); // Log 12
      });
  }, [endpoint, dispatch]);

  useEffect(() => {
    if (schema) {
      console.log('GraphQL Schema:', schema); // Add this line to log the schema
      const queryType = schema.types.find(type => type.name === 'Query');
      const queryFields = queryType ? queryType.fields : [];

      const processField = (field, types, depth = 0, maxDepth = 3) => {
        if (depth >= maxDepth) return field;

        const fieldType = field.type.kind === 'NON_NULL' ? field.type.ofType : field.type;
        const matchingType = types.find(t => t.name === fieldType.name);
        
        return {
          ...field,
          fields: matchingType && matchingType.kind === 'OBJECT' 
            ? matchingType.fields.map(f => processField(f, types, depth + 1, maxDepth))
            : undefined
        };
      };

      const processedSchema = schema.types
        .filter(type => !type.name.startsWith('__') && type.kind === 'OBJECT' && type.name !== 'Query')
        .map(type => {
          const pluralName = `${type.name.toLowerCase()}s`;
          const matchingField = queryFields.find(field => 
            field.name.toLowerCase() === pluralName || field.name.toLowerCase() === type.name.toLowerCase()
          );

          return {
            name: type.name,
            kind: type.kind,
            query_field: matchingField ? matchingField.name : type.name,
            fields: type.fields.map(field => processField(field, schema.types))
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      setLocalSchema(processedSchema);
    }
  }, [schema]);

  useEffect(() => {
    setEditableQuery(generateQuery());
  }, [selectedFields, queryLimit]);

  const handleSelect = (fieldPath, queryField) => {
    setSelectedFields(prev => {
      if (!Array.isArray(fieldPath)) return prev;
      
      const pathString = fieldPath.join('.');
      const exists = prev.some(f => f && Array.isArray(f.path) && f.path.join('.') === pathString);
      
      if (exists) {
        return prev.filter(f => f && Array.isArray(f.path) && f.path.join('.') !== pathString);
      } else {
        const newField = { 
          path: fieldPath, 
          queryField: queryField // This should be the query_field from the schema
        };
        return [...prev.filter(f => f && Array.isArray(f.path) && !fieldPath.every((p, i) => p === f.path[i])), newField];
      }
    });
  };

  const generateQuery = () => {
    if (selectedFields.length === 0) {
      return '# Select fields from the Schema Hierarchy to generate a query';
    }

    const buildQueryString = (fields, depth = 1, maxDepth = 5) => {
      if (depth > maxDepth) return '';

      const indent = '  '.repeat(depth);
      const groupedFields = fields.reduce((acc, field) => {
        if (!field || !field.path || !Array.isArray(field.path)) return acc;
        
        const [dataset, ...rest] = field.path;
        const queryField = field.queryField || dataset;
        
        if (!acc[queryField]) {
          acc[queryField] = [];
        }
        
        if (rest.length > 0) {
          acc[queryField].push({ path: rest });
        } else {
          acc[queryField].push({ path: [] });
        }
        
        return acc;
      }, {});

      return Object.entries(groupedFields).map(([key, subFields]) => {
        const limitArg = depth === 1 ? `(limit: ${queryLimit})` : '';
        if (subFields.length === 0 || subFields.every(f => f.path.length === 0)) {
          return `${indent}${key}${limitArg}`;
        } else {
          const fieldString = buildQueryString(subFields, depth + 1, maxDepth);
          return fieldString ? `${indent}${key}${limitArg} {\n${fieldString}\n${indent}}` : `${indent}${key}${limitArg}`;
        }
      }).join('\n');
    };

    return `query {
${buildQueryString(selectedFields)}
}`;
  };

  const handleEndpointChange = (e) => {
    dispatch(setEndpoint(e.target.value));
  };

  const handleExecuteQuery = () => {
    dispatch(executeQuery({ endpoint, query: editableQuery }));
  };

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQueryLimit(isNaN(value) ? 10 : Math.max(1, value));
  };

  const handleQueryChange = (e) => {
    setEditableQuery(e.target.value);
  };

  const handleSaveQuery = () => {
    if (!queryName.trim()) {
      alert('Please enter a name for the query');
      return;
    }

    const queryData = {
      name: queryName,
      resultType: 'object', // You might want to make this dynamic
      queryString: editableQuery,
      endpoint: endpoint,
      fields: selectedFields.map(field => ({
        name: field.path[field.path.length - 1],
        dataType: 'String' // You might want to infer this from the schema
      }))
    };

    if (currentQueryId) {
      dispatch(updateQuery({ ...queryData, _id: currentQueryId }))
        .then(() => {
          console.log('Query updated successfully');
          dispatch(fetchQueries()); // Refresh the list of queries
        });
    } else {
      dispatch(createQuery(queryData))
        .then(() => {
          console.log('Query created successfully');
          dispatch(fetchQueries()); // Refresh the list of queries
        });
    }

    setQueryName('');
    setCurrentQueryId(null);
  };

  const handleDeleteQuery = (queryId) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      dispatch(deleteQuery(queryId))
        .then(() => {
          console.log('Query deleted successfully');
          dispatch(fetchQueries()); // Refresh the list of queries
        });
    }
  };

  const handleLoadQuery = (query) => {
    setEditableQuery(query.queryString);
    setEndpoint(query.endpoint);
    setQueryName(query.name);
    setCurrentQueryId(query._id);
    // You might want to update selectedFields here as well
  };

  return (
    <div className="graphql-query-tab h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="mb-4">
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700">GraphQL Endpoint</label>
          <input
            type="text"
            id="endpoint"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={endpoint}
            onChange={handleEndpointChange}
          />
        </div>
        {schemaLoading && <p>Loading schema...</p>}
        {schemaError && <p className="text-red-500">Error loading schema: {schemaError}</p>}
        {localSchema.length > 0 && (
          <div className="mt-4 flex flex-col">
            <div className="flex mb-4">
              <div className="w-1/2 pr-4">
                <h3 className="text-lg font-semibold mb-2">Schema Hierarchy</h3>
                <div className="border rounded p-2 h-64 overflow-y-auto">
                  <ul>
                    {localSchema.map(item => (
                      <SchemaItem
                        key={item.name}
                        item={item}
                        onSelect={handleSelect}
                        selectedFields={selectedFields}
                      />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <h3 className="text-lg font-semibold mb-2">Query Editor</h3>
                <textarea
                  className="w-full h-64 p-2 border rounded mb-2"
                  value={editableQuery}
                  onChange={(e) => setEditableQuery(e.target.value)}
                />
                <div className="flex items-center mb-2">
                  <label htmlFor="queryLimit" className="mr-2">Limit:</label>
                  <input
                    type="number"
                    id="queryLimit"
                    className="border rounded p-1 w-20"
                    value={queryLimit}
                    onChange={(e) => setQueryLimit(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label htmlFor="queryName" className="mr-2">Query Name:</label>
                  <input
                    type="text"
                    id="queryName"
                    className="border rounded p-1 w-64"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="Enter query name"
                  />
                </div>
                <button
                  onClick={() => dispatch(executeQuery({ endpoint, query: editableQuery }))}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  disabled={queryLoading}
                >
                  {queryLoading ? 'Executing...' : 'Execute Query'}
                </button>
                <button
                  onClick={handleSaveQuery}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  {currentQueryId ? 'Update Query' : 'Save Query'}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Query Result</h3>
              {queryError && <p className="text-red-500 mb-2">Error: {queryError}</p>}
              <textarea
                className="w-full h-64 p-2 border rounded mb-2"
                value={queryResult ? JSON.stringify(queryResult, null, 2) : ''}
                readOnly
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Saved Queries</h3>
              {queriesStatus === 'loading' && <p>Loading queries...</p>}
              {queriesError && (
                <p className="text-red-500 mb-2">
                  Error loading queries: {queriesError}
                  <br />
                  Status: {queriesStatus}
                </p>
              )}
              <ul>
                {queries.map(query => (
                  <li key={query._id} className="mb-4 p-4 border rounded">
                    <h4 className="font-bold">{query.name}</h4>
                    <p>Result Type: {query.resultType}</p>
                    <p className="mb-2">Endpoint: {query.endpoint}</p>
                    <pre className="bg-gray-100 p-2 rounded">{query.queryString}</pre>
                    <div className="mt-2">
                      <button 
                        onClick={() => handleLoadQuery(query)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => handleDeleteQuery(query._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQLQueryTab;