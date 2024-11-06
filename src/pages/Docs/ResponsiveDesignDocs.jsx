const ResponsiveDesignDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Responsive Design Controls</h2>
        <p className="text-gray-700 mb-4">
          Learn how to create responsive layouts using built-in controls and settings. Our components provide various ways to handle different screen sizes without writing custom CSS.
        </p>
      </section>

      <section id="flex-container-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Flex Container Controls</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-2">Key Settings:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Direction:</strong> Switch between 'row' and 'column' for different screen sizes</li>
            <li><strong>Wrap:</strong> Enable wrapping for flexible item arrangement</li>
            <li><strong>Gap:</strong> Set consistent spacing that adapts to layout changes</li>
            <li><strong>Min/Max Width:</strong> Control container boundaries across screen sizes</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Common Patterns:</h4>
          <pre className="text-sm overflow-x-auto">
{`// Row layout on desktop, column on mobile
{
  direction: "row",
  wrap: true,
  gap: "16px",
  mobileSettings: {
    direction: "column"
  }
}`}</pre>
        </div>
      </section>

      <section id="component-sizing" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Sizing</h2>
        
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium mb-2">Responsive Width Controls:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Percentage Width:</strong> Use relative widths (e.g., "50%") for flexible sizing</li>
            <li><strong>Max-Width:</strong> Prevent components from becoming too wide</li>
            <li><strong>Min-Width:</strong> Ensure readability on small screens</li>
            <li><strong>Auto Width:</strong> Let components size based on content</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Height Management:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Aspect Ratio:</strong> Maintain proportions across screen sizes</li>
            <li><strong>Max-Height:</strong> Control vertical space on mobile</li>
            <li><strong>Auto Height:</strong> Allow natural content flow</li>
          </ul>
        </div>
      </section>

      <section id="breakpoint-behavior" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Breakpoint Behavior</h2>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Standard Breakpoints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Mobile:</strong> &lt; 768px</li>
            <li><strong>Tablet:</strong> 768px - 1024px</li>
            <li><strong>Desktop:</strong> &gt; 1024px</li>
          </ul>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Example Configuration:</h4>
          <pre className="text-sm overflow-x-auto">
{`{
  desktop: {
    width: "33%",
    direction: "row"
  },
  tablet: {
    width: "50%",
    direction: "row"
  },
  mobile: {
    width: "100%",
    direction: "column"
  }
}`}</pre>
        </div>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Start with mobile layout and enhance for larger screens</li>
          <li>Use relative units (%, vh, vw) instead of fixed pixels</li>
          <li>Test layouts with different content lengths</li>
          <li>Consider touch targets on mobile (minimum 44px)</li>
          <li>Use flex-wrap for natural content flow</li>
        </ul>
      </section>

      <section id="common-patterns" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Common Responsive Patterns</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Card Grid</h3>
            <pre className="text-sm overflow-x-auto">
{`// Responsive card grid layout
{
  direction: "row",
  wrap: true,
  gap: "16px",
  childWidth: {
    desktop: "calc(33.33% - 16px)",
    tablet: "calc(50% - 16px)",
    mobile: "100%"
  }
}`}</pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Sidebar Layout</h3>
            <pre className="text-sm overflow-x-auto">
{`// Responsive sidebar layout
{
  direction: {
    desktop: "row",
    mobile: "column"
  },
  sidebarWidth: {
    desktop: "250px",
    mobile: "100%"
  }
}`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResponsiveDesignDocs; 