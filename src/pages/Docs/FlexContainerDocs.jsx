import React from 'react';

const FlexContainerDocs = () => {
  return (
    <div className="flex-1">
      {/* Overview Section */}
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Flex Container component is a versatile layout component that uses CSS Flexbox to arrange child elements.
          It provides powerful controls for creating responsive layouts, managing content flow, and adding interactive effects.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Flexible layout control with CSS Flexbox properties</li>
          <li>Interactive hover effects for container and content</li>
          <li>Built-in page navigation capabilities</li>
          <li>Customizable borders and spacing</li>
          <li>Responsive sizing and positioning</li>
        </ul>
      </section>

      {/* Layout Controls Section */}
      <section id="layout-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Layout Controls</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Flex Direction</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Row: Arrange items horizontally (left to right)</li>
          <li>Column: Arrange items vertically (top to bottom)</li>
          <li>Row Reverse: Right to left arrangement</li>
          <li>Column Reverse: Bottom to top arrangement</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Alignment Controls</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Justify Content: Controls alignment along the main axis</li>
          <li>Align Items: Controls alignment along the cross axis</li>
          <li>Align Content: Controls spacing between multiple lines</li>
          <li>Gap: Sets spacing between child elements</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Sizing Options</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Width and Height: Fixed or responsive dimensions</li>
          <li>Min/Max constraints: Control size boundaries</li>
          <li>Flex Grow/Shrink: Dynamic size adjustment</li>
          <li>Flex Basis: Initial main size of container</li>
        </ul>
      </section>

      {/* Hover Effects Section */}
      <section id="hover-effects" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hover Effects</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Available Effects:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Background Color:</strong> Change container background on hover</li>
            <li><strong>Text Color:</strong> Modify text color of container and children</li>
            <li><strong>Scale:</strong> Zoom effect on hover</li>
            <li><strong>Cursor:</strong> Custom cursor styles</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`// Example of hover effects configuration
{
  style: {
    hoverBackgroundColor: "#f0f0f0",
    hoverTextColor: "#0000ff",
    hoverScale: 1.05,
    cursor: "pointer"
  }
}`}
          </pre>
        </div>
      </section>

      {/* Navigation Section */}
      <section id="navigation" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Navigation Features</h2>
        
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Page Navigation:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Enable container-level page navigation</li>
            <li>Set target page ID for navigation</li>
            <li>Combines with hover effects for interactive elements</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`// Example of navigation configuration
{
  style: {
    enablePageNavigation: true,
    targetPageId: "page-123",
    hoverBackgroundColor: "#e0e0e0"  // Optional visual feedback
  }
}`}
          </pre>
        </div>
      </section>

      {/* Best Practices Section */}
      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Use appropriate flex direction based on content type</li>
          <li>Consider mobile responsiveness when setting dimensions</li>
          <li>Combine hover effects with navigation for better UX</li>
          <li>Use gap property instead of margins for consistent spacing</li>
          <li>Set min/max dimensions to prevent layout breaks</li>
        </ul>
      </section>

      {/* Code Examples Section */}
      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Layout Container</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Basic flex container with row layout
const Container = () => (
  <FlexContainer
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      padding: "20px"
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Interactive Container</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Container with hover effects and navigation
const InteractiveContainer = () => (
  <FlexContainer
    style={{
      flexDirection: "column",
      alignItems: "center",
      hoverBackgroundColor: "#f0f0f0",
      hoverScale: 1.05,
      enablePageNavigation: true,
      targetPageId: "target-page",
      transition: "all 0.3s ease"
    }}
  />
)`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default FlexContainerDocs;
