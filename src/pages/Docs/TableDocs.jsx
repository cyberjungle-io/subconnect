import React from 'react';

const TableDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Table component provides a flexible way to display and manage tabular data. 
          It supports dynamic data loading from GraphQL queries, customizable styling, pagination, 
          and advanced formatting options for different data types.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Dynamic data loading through GraphQL queries</li>
          <li>Customizable column selection and naming</li>
          <li>Built-in pagination support</li>
          <li>Automatic data formatting for dates and numbers</li>
          <li>Alternating row colors</li>
          <li>Customizable styling for headers, rows, and borders</li>
          <li>Sticky headers for better scrolling experience</li>
        </ul>
      </section>

      <section id="data-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Configuration</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Query Selection</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Choose from available GraphQL queries</li>
          <li>Automatic field detection from query schema</li>
          <li>Dynamic column selection based on available fields</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Column Configuration</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Multi-select column picker</li>
          <li>Custom column header naming</li>
          <li>Support for nested data fields</li>
        </ul>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-medium mb-2">Data Type Support:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Date:</strong> Automatic formatting with customizable patterns</li>
            <li><strong>Number:</strong> Formatting with thousands separators and decimal places</li>
            <li><strong>Text:</strong> Plain text display with overflow handling</li>
          </ul>
        </div>
      </section>

      <section id="visual-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Visual Controls</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Color Customization</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Header background color</li>
          <li>Header text color</li>
          <li>Row background color</li>
          <li>Alternate row background color</li>
          <li>Row text color</li>
          <li>Border color</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Layout Options</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Toggle border visibility</li>
          <li>Toggle header visibility</li>
          <li>Adjustable page size</li>
          <li>Responsive width handling</li>
        </ul>
      </section>

      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Basic Table Setup</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Basic table with default styling
const MyTable = () => (
  <TableRenderer
    component={{
      props: {
        columns: [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'value', header: 'Value' }
        ],
        data: [
          { id: 1, name: 'Item 1', value: 100 },
          { id: 2, name: 'Item 2', value: 200 }
        ],
        pageSize: 10
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Styled Table with GraphQL</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Table with custom styling and GraphQL data
const StyledTable = () => (
  <TableRenderer
    component={{
      props: {
        selectedQueryId: 'your-query-id',
        columns: [
          { key: 'date', type: 'date', format: 'yyyy-MM-dd' },
          { key: 'amount', type: 'number', format: '0,0.00' }
        ],
        headerBackgroundColor: '#f3f4f6',
        headerTextColor: '#374151',
        rowBackgroundColor: '#ffffff',
        alternateRowBackgroundColor: '#f9fafb',
        showBorder: true,
        borderColor: '#e5e7eb'
      }
    }}
  />
)`}
          </pre>
        </div>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Set appropriate page sizes based on data volume and container height</li>
          <li>Use consistent color schemes for better visual hierarchy</li>
          <li>Implement proper data formatting for better readability</li>
          <li>Consider mobile responsiveness when selecting columns</li>
          <li>Use meaningful column names for better user understanding</li>
        </ul>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Data not displaying:</strong>
              <p>Verify GraphQL query selection and field mapping</p>
            </li>
            <li>
              <strong>Formatting issues:</strong>
              <p>Check data type configurations and format patterns</p>
            </li>
            <li>
              <strong>Layout problems:</strong>
              <p>Ensure container dimensions are properly set</p>
            </li>
          </ul>
        </div>
      </section>

      <section id="performance" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Performance Considerations</h2>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Use pagination for large datasets</li>
            <li>Limit the number of visible columns</li>
            <li>Optimize GraphQL queries to fetch only needed fields</li>
            <li>Consider implementing virtual scrolling for very large datasets</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default TableDocs; 