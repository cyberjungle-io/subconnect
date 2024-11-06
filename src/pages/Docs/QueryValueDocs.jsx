import React from 'react';

const QueryValueDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Query Value component provides a flexible way to display and format data from GraphQL queries. 
          It automatically handles query execution, data extraction, and offers extensive formatting options 
          for numerical and text values.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Direct integration with GraphQL queries</li>
          <li>Automatic data field extraction</li>
          <li>Comprehensive number formatting options</li>
          <li>Customizable prefix and suffix display</li>
          <li>Flexible positioning and styling options</li>
        </ul>
      </section>

      <section id="formatting-options" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Formatting Options</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Number Formatting</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Decimal places control (0-20 places)</li>
          <li>Percentage conversion</li>
          <li>Comma separation for large numbers</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Prefix & Suffix</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Custom prefix text (e.g., currency symbols)</li>
          <li>Custom suffix text (e.g., units)</li>
          <li>Independent color control for prefix/suffix</li>
          <li>Adjustable font sizes</li>
          <li>Three suffix positions: top, middle, bottom</li>
        </ul>
      </section>

      <section id="usage-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Basic Query Value</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
{`const BasicQueryValue = () => (
  <QueryValueRenderer
    component={{
      props: {
        queryId: "your-query-id",
        field: "data.value"
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Formatted Currency</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
{`const CurrencyValue = () => (
  <QueryValueRenderer
    component={{
      props: {
        queryId: "price-query-id",
        field: "data.price",
        prefix: "$",
        prefixColor: "#00875A",
        decimalPlaces: 2,
        useCommas: true
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Percentage Display</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`const PercentageValue = () => (
  <QueryValueRenderer
    component={{
      props: {
        queryId: "percentage-query-id",
        field: "data.ratio",
        isPercentage: true,
        decimalPlaces: 1,
        suffix: "growth",
        suffixPosition: "top"
      }
    }}
  />
)`}
          </pre>
        </div>
      </section>

      <section id="configuration" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Configuration Options</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-2">Query Configuration</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><code>queryId</code>: ID of the GraphQL query to execute</li>
            <li><code>field</code>: Dot-notation path to the desired data field</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-2">Number Formatting</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><code>decimalPlaces</code>: Number of decimal places to display</li>
            <li><code>useCommas</code>: Enable/disable comma separation</li>
            <li><code>isPercentage</code>: Convert value to percentage</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Display Options</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><code>prefix</code>: Text to display before the value</li>
            <li><code>prefixColor</code>: Color of the prefix text</li>
            <li><code>prefixSize</code>: Font size of the prefix</li>
            <li><code>suffix</code>: Text to display after the value</li>
            <li><code>suffixColor</code>: Color of the suffix text</li>
            <li><code>suffixSize</code>: Font size of the suffix</li>
            <li><code>suffixPosition</code>: Position of suffix (top/middle/bottom)</li>
          </ul>
        </div>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Use appropriate decimal places for your data type</li>
          <li>Consider suffix positioning for readability</li>
          <li>Maintain consistent formatting across related values</li>
          <li>Use color coding thoughtfully for prefix/suffix</li>
          <li>Ensure GraphQL queries are optimized for performance</li>
        </ul>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Value not displaying:</strong>
              <p>Verify the field path matches your GraphQL query structure</p>
            </li>
            <li>
              <strong>Formatting not applying:</strong>
              <p>Check if the value is actually a number and not a string</p>
            </li>
            <li>
              <strong>Query errors:</strong>
              <p>Ensure the GraphQL query is valid and the endpoint is accessible</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default QueryValueDocs; 