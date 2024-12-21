import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSave, FaPlay, FaPlus, FaCode, FaTable } from 'react-icons/fa';
import { w3sService } from '../../w3s/w3sService';

const WebServiceTab = () => {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [detectedFormat, setDetectedFormat] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [showRawData, setShowRawData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [currentService, setCurrentService] = useState({
    name: '',
    type: 'data',
    method: 'GET',
    endpoint: '',
    authentication: {
      type: 'none',
      credentials: {}
    },
    dataMapping: {
      resultPath: '',
      fields: [],
      transforms: []
    },
    actionConfig: {
      confirmationRequired: false,
      successMessage: '',
      errorMessage: ''
    }
  });

  useEffect(() => {
    fetchWebServices();
  }, []);

  const fetchWebServices = async () => {
    try {
      const data = await w3sService.getWebServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching web services:', error);
    }
  };

  const validateService = (service) => {
    const errors = [];
    if (!service.name) errors.push('Name is required');
    if (!service.endpoint) errors.push('Endpoint URL is required');
    if (!['data', 'action'].includes(service.type)) errors.push('Invalid service type');
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(service.method)) errors.push('Invalid HTTP method');
    if (!['none', 'bearer', 'api-key'].includes(service.authentication.type)) errors.push('Invalid authentication type');
    return errors;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Validate
      const errors = validateService(currentService);
      if (errors.length > 0) {
        setSaveError(errors.join(', '));
        return;
      }

      let savedService;
      if (currentService._id) {
        savedService = await w3sService.updateWebService(currentService._id, currentService);
      } else {
        savedService = await w3sService.createWebService(currentService);
      }
      
      // Update local state
      if (currentService._id) {
        setServices(prev => prev.map(s => s._id === savedService._id ? savedService : s));
      } else {
        setServices(prev => [...prev, savedService]);
      }

      // Reset error state
      setSaveError(null);

      // Show success feedback
      // TODO: Add a toast notification system
      console.log('Web service saved successfully');

    } catch (error) {
      console.error('Save error:', error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const detectDataFormat = (data) => {
    try {
      // Try parsing as JSON
      JSON.parse(JSON.stringify(data));
      return 'json';
    } catch {
      // Check if it's XML
      if (typeof data === 'string' && data.trim().startsWith('<?xml')) {
        return 'xml';
      }
      // Check if it's CSV/TSV
      if (typeof data === 'string' && data.includes(',')) {
        return 'csv';
      }
      if (typeof data === 'string' && data.includes('\t')) {
        return 'tsv';
      }
    }
    return 'unknown';
  };

  const extractAvailableFields = (data, format) => {
    try {
      if (format === 'json') {
        const fields = [];
        const extractFields = (obj, prefix = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            const path = prefix ? `${prefix}.${key}` : key;
            fields.push(path);
            
            // Recursively extract nested fields
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              extractFields(value, path);
            }
          });
        };

        if (Array.isArray(data)) {
          // If it's an array, use the first item
          if (data[0]) extractFields(data[0]);
        } else {
          // If it's an object, use it directly
          extractFields(data);
        }
        
        return fields;
      }
      return [];
    } catch {
      return [];
    }
  };

  const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const handleTest = async () => {
    try {
      const response = await fetch(currentService.endpoint, {
        method: currentService.method,
        headers: {
          'Content-Type': 'application/json',
          ...(currentService.authentication?.type === 'bearer' 
            ? { Authorization: `Bearer ${currentService.authentication.credentials.token}` }
            : currentService.authentication?.type === 'api-key'
            ? { [currentService.authentication.credentials.header]: currentService.authentication.credentials.key }
            : {})
        }
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const format = detectDataFormat(data);
      const fields = extractAvailableFields(data, format);
      
      // Filter out object fields and add all other fields to dataMapping
      const nonObjectFields = fields.filter(field => {
        const value = getValueByPath(data, field);
        return !(value && typeof value === 'object' && !Array.isArray(value));
      });

      setCurrentService(prev => ({
        ...prev,
        dataMapping: {
          ...prev.dataMapping,
          fields: nonObjectFields
        }
      }));
      
      setTestResult(data);
      setDetectedFormat(format);
      setAvailableFields(fields);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({ error: error.message });
      setDetectedFormat('error');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Web Service Configuration</h3>
          <p className="text-sm text-gray-600">Configure and test web services for your components</p>
          {saveError && (
            <p className="mt-2 text-sm text-red-600">{saveError}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleTest}
            className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            <FaPlay className="h-4 w-4 mr-2" />
            Test
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isSaving
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <FaSave className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={currentService.name}
                onChange={(e) => setCurrentService(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full p-2 border rounded-md ${
                  saveError && !currentService.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="My Web Service"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={currentService.type}
                onChange={(e) => setCurrentService(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="data">Data Service</option>
                <option value="action">Action Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* Request Configuration */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Request Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTTP Method
              </label>
              <select
                value={currentService.method}
                onChange={(e) => setCurrentService(prev => ({ ...prev, method: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endpoint URL
              </label>
              <input
                type="text"
                value={currentService.endpoint}
                onChange={(e) => setCurrentService(prev => ({ ...prev, endpoint: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="https://api.example.com/data"
              />
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Authentication</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authentication Type
              </label>
              <select
                value={currentService.authentication.type}
                onChange={(e) => setCurrentService(prev => ({
                  ...prev,
                  authentication: {
                    type: e.target.value,
                    credentials: {}
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="none">None</option>
                <option value="bearer">Bearer Token</option>
                <option value="api-key">API Key</option>
              </select>
            </div>

            {currentService.authentication.type === 'bearer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bearer Token
                </label>
                <input
                  type="text"
                  value={currentService.authentication.credentials.token || ''}
                  onChange={(e) => setCurrentService(prev => ({
                    ...prev,
                    authentication: {
                      ...prev.authentication,
                      credentials: { token: e.target.value }
                    }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter bearer token"
                />
              </div>
            )}

            {currentService.authentication.type === 'api-key' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key Header
                  </label>
                  <input
                    type="text"
                    value={currentService.authentication.credentials.header || ''}
                    onChange={(e) => setCurrentService(prev => ({
                      ...prev,
                      authentication: {
                        ...prev.authentication,
                        credentials: {
                          ...prev.authentication.credentials,
                          header: e.target.value
                        }
                      }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="X-API-Key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={currentService.authentication.credentials.key || ''}
                    onChange={(e) => setCurrentService(prev => ({
                      ...prev,
                      authentication: {
                        ...prev.authentication,
                        credentials: {
                          ...prev.authentication.credentials,
                          key: e.target.value
                        }
                      }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter API key"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Response Configuration */}
        {currentService.type === 'data' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Data Mapping</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Result Path
                </label>
                <input
                  type="text"
                  value={currentService.dataMapping.resultPath}
                  onChange={(e) => setCurrentService(prev => ({
                    ...prev,
                    dataMapping: {
                      ...prev.dataMapping,
                      resultPath: e.target.value
                    }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="data.results"
                />
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Test Results</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    showRawData ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaCode className="inline-block mr-1" />
                  Raw
                </button>
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    !showRawData ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaTable className="inline-block mr-1" />
                  Parsed
                </button>
              </div>
            </div>
            
            <div className="mb-2 text-sm">
              <span className="font-medium">Detected Format:</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                {detectedFormat}
              </span>
            </div>

            {showRawData ? (
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 border border-gray-200 max-h-96">
                {typeof testResult === 'string' 
                  ? testResult 
                  : JSON.stringify(testResult, null, 2)}
              </pre>
            ) : (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Field Values:</h5>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Field Path
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {availableFields.map((field) => {
                          const value = getValueByPath(testResult, field);
                          const isObject = value && typeof value === 'object' && !Array.isArray(value);
                          if (isObject) return null;
                          
                          return (
                            <tr key={field}>
                              <td className="px-3 py-2 text-sm text-gray-900">{field}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {formatValue(value)}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500">
                                {Array.isArray(value) ? 'array' : typeof value}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebServiceTab; 