import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries, createQuery, updateQuery, deleteQuery } from '../../w3s/w3sSlice';
import { setEndpoint, fetchGraphQLSchema, executeQuery } from '../../features/graphQLSlice';
import GraphQLQueryBuilder from './GraphQLQueryBuilder';
import GraphQLQueryManual from './GraphQLQueryManual';

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
  const [querySource, setQuerySource] = useState('builder');
  const [parsedFields, setParsedFields] = useState([]);

  useEffect(() => {
    dispatch(fetchGraphQLSchema(endpoint));
    dispatch(fetchQueries());
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
    if (querySource === 'manual') {
      const fields = parseQueryString(editableQuery);
      setParsedFields(fields);
    }
  }, [editableQuery, querySource]);

  const parseQueryString = (queryString) => {
    // Remove comments and whitespace
    queryString = queryString.replace(/#.*$/gm, '').trim();

    // Extract the query body
    const match = queryString.match(/(?:query\s*\w*\s*)?{([\s\S]*)}/);
    if (!match) return [];

    const queryBody = match[1].trim();
    const fields = extractFields(queryBody);

    // Remove the top-level field (dataset name) and flatten the field structure
    return fields.length > 0 ? flattenFields(fields[0].subfields || []).map(field => ({
      ...field,
      dataType: field.dataType || 'String' // Ensure each field has a dataType
    })) : [];
  };

  const extractFields = (queryBody, prefix = '') => {
    const fields = [];
    const lines = queryBody.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const fieldMatch = line.match(/^(\w+)(\s*[\(\{])?/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const hasSubfields = line.includes('{');

        if (hasSubfields) {
          // Find the closing brace
          let subfields = '';
          let braceCount = 1;
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes('{')) braceCount++;
            if (lines[j].includes('}')) braceCount--;
            if (braceCount === 0) {
              subfields = lines.slice(i + 1, j).join('\n');
              i = j;
              break;
            }
          }
          fields.push({
            name: prefix ? `${prefix}.${fieldName}` : fieldName,
            subfields: extractFields(subfields, prefix ? `${prefix}.${fieldName}` : fieldName)
          });
        } else {
          fields.push({
            name: prefix ? `${prefix}.${fieldName}` : fieldName,
            dataType: 'String' // Default data type
          });
        }
      }
    }

    return fields;
  };

  const flattenFields = (fields) => {
    if (!Array.isArray(fields)) return [];
    
    return fields.reduce((acc, field) => {
      if (field.subfields) {
        return [...acc, ...flattenFields(field.subfields)];
      }
      return [...acc, field];
    }, []);
  };

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
        if (subFields.length === 0 || subFields.every(f => f.path.length === 0)) {
          return `${indent}${key}`;
        } else {
          const fieldString = buildQueryString(subFields, depth + 1, maxDepth);
          return fieldString ? `${indent}${key} {\n${fieldString}\n${indent}}` : `${indent}${key}`;
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
      fields: querySource === 'builder' 
        ? selectedFields.map(field => ({
            name: field.path[field.path.length - 1],
            dataType: 'String' // You might want to infer this from the schema
          }))
        : parsedFields, // These now include the user-selected data types
      querySource: querySource
    };

    if (currentQueryId) {
      dispatch(updateQuery({ ...queryData, _id: currentQueryId }))
        .then(() => {
          console.log('Query updated successfully');
          dispatch(fetchQueries());
        });
    } else {
      dispatch(createQuery(queryData))
        .then(() => {
          console.log('Query created successfully');
          dispatch(fetchQueries());
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
          dispatch(fetchQueries());
        });
    }
  };

  const handleLoadQuery = (query) => {
    setEditableQuery(query.queryString);
    setEndpoint(query.endpoint);
    setQueryName(query.name);
    setCurrentQueryId(query._id);
    setQuerySource(query.querySource || 'builder');
    if (query.querySource === 'manual') {
      setParsedFields(parseQueryString(query.queryString));
    } else {
      setSelectedFields(query.fields.map(field => ({ path: [field.name] })));
    }
  };

  const handleDataTypeChange = (index, newDataType) => {
    setParsedFields(prevFields => 
      prevFields.map((field, i) => 
        i === index ? { ...field, dataType: newDataType } : field
      )
    );
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
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2">Query Source</h3>
                <div className="flex items-center mb-4">
                  <label className="mr-4">
                    <input
                      type="radio"
                      value="builder"
                      checked={querySource === 'builder'}
                      onChange={() => setQuerySource('builder')}
                      className="mr-2"
                    />
                    Builder
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="manual"
                      checked={querySource === 'manual'}
                      onChange={() => setQuerySource('manual')}
                      className="mr-2"
                    />
                    Manual
                  </label>
                </div>
                {querySource === 'builder' ? (
                  <GraphQLQueryBuilder
                    localSchema={localSchema}
                    selectedFields={selectedFields}
                    handleSelect={handleSelect}
                  />
                ) : (
                  <GraphQLQueryManual
                    parsedFields={parsedFields}
                    handleDataTypeChange={handleDataTypeChange}
                    editableQuery={editableQuery}
                    setEditableQuery={setEditableQuery}
                    handleExecuteQuery={handleExecuteQuery}
                    handleSaveQuery={handleSaveQuery}
                  />
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Query Result</h3>
              {queryError && <p className="text-red-500 mb-2">Error: {queryError}</p>}
              <textarea
                className="w-full h-64 p-2 border rounded mb-2"
                value={queryResult ? JSON.stringify(queryResult, null, 2) : ''}
                readOnly
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Saved Queries</h3>
              {queriesStatus === 'loading' && <p>Loading queries...</p>}
              {queriesError && <p className="text-red-500 mb-2">Error loading queries: {queriesError}</p>}
              <ul>
                {queries.map(query => (
                  <li key={query._id} className="mb-4 p-4 border rounded">
                    <h4 className="font-bold">{query.name}</h4>
                    <p>Result Type: {query.resultType}</p>
                    <p>Query Source: {query.querySource || 'N/A'}</p>
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