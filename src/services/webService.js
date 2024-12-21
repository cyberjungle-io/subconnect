export class WebServiceExecutor {
  static async execute(config) {
    const { endpoint, method = 'GET', headers = {}, body, authentication, type } = config;
    
    try {
      // Add authentication headers
      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers,
        ...(authentication?.type === 'bearer' 
          ? { Authorization: `Bearer ${authentication.credentials.token}` }
          : authentication?.type === 'api-key'
          ? { [authentication.credentials.header]: authentication.credentials.key }
          : {})
      };

      // Execute request
      const response = await fetch(endpoint, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        throw new Error(`Service request failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle data transformation if this is a data service
      if (type === 'data' && config.responseMapping) {
        return this.transformResponse(data, config.responseMapping);
      }

      return data;
    } catch (error) {
      console.error('Web service execution failed:', error);
      throw error;
    }
  }

  static transformResponse(data, mapping) {
    try {
      // Extract data using path
      let transformedData = data;
      if (mapping.path) {
        transformedData = mapping.path.split('.').reduce((obj, key) => obj?.[key], data);
      }

      // Apply mapping transformations
      if (mapping.type === 'chart') {
        return this.transformChartData(transformedData, mapping.mapping);
      } else if (mapping.type === 'table') {
        return this.transformTableData(transformedData, mapping.mapping);
      }

      return transformedData;
    } catch (error) {
      console.error('Data transformation failed:', error);
      throw error;
    }
  }

  static transformChartData(data, mapping) {
    if (!Array.isArray(data)) {
      throw new Error('Chart data must be an array');
    }

    return data.map(item => ({
      x: mapping.x ? item[mapping.x] : undefined,
      y: mapping.y ? item[mapping.y] : undefined,
      ...mapping.additional?.reduce((acc, field) => ({
        ...acc,
        [field]: item[field]
      }), {})
    }));
  }

  static transformTableData(data, mapping) {
    if (!Array.isArray(data)) {
      throw new Error('Table data must be an array');
    }

    if (mapping.columns) {
      return data.map(item => 
        mapping.columns.reduce((acc, col) => ({
          ...acc,
          [col]: item[col]
        }), {})
      );
    }

    return data;
  }
} 