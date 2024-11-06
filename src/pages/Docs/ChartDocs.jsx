import React from 'react';

const ChartDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Chart component system provides a flexible and interactive way to visualize data through various chart types.
          Built on Recharts, it supports dynamic data loading through GraphQL queries and offers extensive customization options.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Multiple chart types (Line, Bar, Area, Pie)</li>
          <li>Dynamic data loading through GraphQL integration</li>
          <li>Customizable styling and appearance</li>
          <li>Interactive tooltips and legends</li>
          <li>Responsive design with auto-scaling</li>
          <li>Date and number formatting options</li>
        </ul>
      </section>

      <section id="chart-types" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Chart Types</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Line Chart</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Best for showing trends over time</li>
          <li>Supports multiple data series</li>
          <li>Optional data points and grid lines</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Bar Chart</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Ideal for comparing quantities</li>
          <li>Supports grouped or stacked bars</li>
          <li>Customizable bar colors and width</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Area Chart</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Shows volume and trends</li>
          <li>Supports stacked areas</li>
          <li>Gradient fill options</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Pie Chart</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Shows part-to-whole relationships</li>
          <li>Customizable slice colors</li>
          <li>Interactive slice selection</li>
        </ul>
      </section>

      <section id="data-configuration" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Configuration</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Data Source Setup:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Query Selection:</strong> Choose a GraphQL query to fetch data</li>
            <li><strong>Data Keys:</strong> Select fields for Y-axis values</li>
            <li><strong>Name Key:</strong> Choose the X-axis field (typically time or categories)</li>
            <li><strong>Series Names:</strong> Customize the display names for each data series</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`// Example data configuration
{
  selectedQueryId: "query123",
  dataKeys: ["revenue", "costs"],
  nameKey: "date",
  seriesNames: {
    revenue: "Monthly Revenue",
    costs: "Operating Costs"
  }
}`}
          </pre>
        </div>
      </section>

      <section id="styling-options" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Title Configuration</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Title text and alignment</li>
          <li>Font size and color</li>
          <li>Margin control</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Colors and Appearance</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Custom color schemes for data series</li>
          <li>Line width and style options</li>
          <li>Data point size and visibility</li>
          <li>Grid line customization</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Legend and Tooltip</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Legend position (top, right, bottom, left)</li>
          <li>Tooltip background and border colors</li>
          <li>Custom tooltip content formatting</li>
        </ul>
      </section>

      <section id="axis-configuration" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Axis Configuration</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">X-Axis Options</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Data type (category, date, number)</li>
          <li>Custom date formatting</li>
          <li>Tick angle and spacing</li>
          <li>Axis label customization</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Y-Axis Options</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Number formatting</li>
          <li>Domain range control</li>
          <li>Grid line visibility</li>
          <li>Axis label customization</li>
        </ul>
      </section>

      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Line Chart</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`const BasicLineChart = () => (
  <ChartRenderer
    component={{
      props: {
        chartType: "line",
        selectedQueryId: "query123",
        dataKeys: ["revenue"],
        nameKey: "date",
        title: "Monthly Revenue",
        showDataPoints: true,
        showGrid: true
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Customized Bar Chart</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`const CustomBarChart = () => (
  <ChartRenderer
    component={{
      props: {
        chartType: "bar",
        selectedQueryId: "query123",
        dataKeys: ["sales", "returns"],
        nameKey: "month",
        colors: ["#4CAF50", "#F44336"],
        title: "Sales vs Returns",
        titleFontSize: 20,
        titleColor: "#333",
        showLegend: true,
        legendPosition: "bottom"
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
          <li>Choose appropriate chart types for your data</li>
          <li>Use consistent color schemes for better readability</li>
          <li>Provide clear titles and labels</li>
          <li>Consider mobile responsiveness when setting dimensions</li>
          <li>Use appropriate date/number formatting for your audience</li>
          <li>Limit the number of data series for clarity</li>
        </ul>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Data not displaying:</strong>
              <p>Verify that the GraphQL query is returning data and the selected data keys match the query response structure.</p>
            </li>
            <li>
              <strong>Date formatting issues:</strong>
              <p>Ensure the date format matches your input data format. Check for invalid date strings.</p>
            </li>
            <li>
              <strong>Axis labels overlapping:</strong>
              <p>Adjust the axis angle or margin settings to accommodate long labels.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ChartDocs;
