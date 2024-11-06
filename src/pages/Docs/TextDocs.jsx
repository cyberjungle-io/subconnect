import React from 'react';

const TextDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Text Component system provides a powerful way to create and style text content with rich formatting options.
          It includes both basic text editing capabilities and advanced styling controls, making it suitable for various text presentation needs.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Rich text formatting with inline styles</li>
          <li>Multiple text element types (paragraphs, headings)</li>
          <li>Advanced typography controls</li>
          <li>Text effects and animations</li>
          <li>Responsive text handling</li>
          <li>Real-time content sanitization</li>
        </ul>
      </section>

      <section id="text-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Text Controls</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Formatting</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Bold, Italic, Underline formatting</li>
          <li>Text alignment (left, center, right)</li>
          <li>Font family selection</li>
          <li>Font size adjustment</li>
          <li>Text color customization</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Typography Settings</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Letter spacing control</li>
          <li>Line height adjustment</li>
          <li>Word spacing</li>
          <li>Text transform options (uppercase, lowercase, capitalize)</li>
          <li>Text decoration (overline, line-through)</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Element Types</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Paragraph (p) - Default size: 16px</li>
          <li>Heading 1 (h1) - Default size: 32px</li>
          <li>Heading 2 (h2) - Default size: 24px</li>
          <li>Heading 3 (h3) - Default size: 18.72px</li>
          <li>Heading 4-6 (h4-h6) - Scaled sizes</li>
        </ul>
      </section>

      <section id="advanced-features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Text Effects</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Text shadow with customizable:</li>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Horizontal offset (X)</li>
            <li>Vertical offset (Y)</li>
            <li>Blur radius</li>
            <li>Shadow color</li>
          </ul>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Interactive Features</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Hover effects:</li>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Underline on hover</li>
            <li>Color change</li>
            <li>Scale effect</li>
          </ul>
          <li>Click actions:</li>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Smooth scroll</li>
            <li>Modal opening</li>
          </ul>
        </ul>
      </section>

      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Text Component</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Basic text with default settings
const MyText = () => (
  <TextRenderer
    component={{
      style: {
        content: "Hello World",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#000000"
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Styled Heading</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Heading with custom styling
const StyledHeading = () => (
  <TextRenderer
    component={{
      style: {
        content: "Styled Heading",
        headingLevel: "h1",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#4B5563",
        textShadow: "2px 2px 4px #00000040"
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
          <li>Use appropriate heading levels for proper document structure</li>
          <li>Maintain consistent font sizes across similar elements</li>
          <li>Consider readability when adjusting letter spacing and line height</li>
          <li>Use text shadows sparingly to maintain readability</li>
          <li>Ensure sufficient color contrast for accessibility</li>
        </ul>
      </section>

      <section id="accessibility" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Considerations</h2>
        <div className="bg-purple-50 p-4 rounded-lg">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Maintain proper heading hierarchy (h1 → h6)</li>
            <li>Ensure sufficient color contrast (WCAG 2.1 guidelines)</li>
            <li>Avoid using very small font sizes (minimum 12px recommended)</li>
            <li>Consider line height for readability (recommended: 1.5)</li>
            <li>Use semantic HTML elements appropriately</li>
          </ul>
        </div>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Text not updating:</strong>
              <p>Ensure content changes are properly sanitized and valid HTML.</p>
            </li>
            <li>
              <strong>Styling not applying:</strong>
              <p>Check if global styles are conflicting with component styles.</p>
            </li>
            <li>
              <strong>Text overflow issues:</strong>
              <p>Verify container dimensions and consider using appropriate overflow settings.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default TextDocs; 