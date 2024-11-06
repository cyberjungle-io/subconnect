import React from 'react';

const WhiteboardDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Whiteboard component provides a versatile drawing and annotation tool with multiple features for creating and editing content in real-time. 
          It supports various drawing tools, shapes, text input, and image integration.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Multiple drawing tools (pen, eraser, shapes, text)</li>
          <li>Customizable pen and eraser sizes</li>
          <li>Shape drawing tools (arrow, square, circle, line)</li>
          <li>Text annotation support</li>
          <li>Image upload and integration</li>
          <li>Undo/Redo functionality</li>
          <li>Color picker for drawing tools</li>
        </ul>
      </section>

      <section id="drawing-tools" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Drawing Tools</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Pen Tool</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Adjustable pen size (1-20px)</li>
          <li>Smooth line drawing with pressure sensitivity</li>
          <li>Color customization</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Eraser Tool</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Adjustable eraser size (5-50px)</li>
          <li>Circular eraser preview</li>
          <li>Precise erasing capabilities</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Shape Tools</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Arrow: Directional indicators with customizable heads</li>
          <li>Square: Rectangle drawing with adjustable dimensions</li>
          <li>Circle: Perfect circles or ellipses</li>
          <li>Line: Straight lines with adjustable thickness</li>
        </ul>
      </section>

      <section id="text-annotation" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Text Annotation</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Click-to-place text anywhere on canvas</li>
          <li>Auto-expanding text input</li>
          <li>Customizable font properties:
            <ul className="list-circle pl-6 mt-2">
              <li>Font size</li>
              <li>Font family</li>
              <li>Text color</li>
            </ul>
          </li>
        </ul>
      </section>

      <section id="image-handling" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Image Handling</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Support for image uploads</li>
          <li>Automatic canvas resizing</li>
          <li>Image preservation during canvas operations</li>
        </ul>
      </section>

      <section id="history-management" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">History Management</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Undo/Redo functionality for all operations</li>
          <li>Automatic state saving</li>
          <li>History persistence across sessions</li>
        </ul>
      </section>

      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Implementation</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Basic whiteboard implementation
const MyWhiteboard = () => (
  <WhiteboardRenderer
    component={{
      id: "whiteboard-1",
      props: {
        backgroundColor: "#ffffff",
      },
      style: {
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }
    }}
    globalSettings={{
      generalComponentStyle: {
        backgroundColor: "#ffffff"
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">With Controls</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`// Whiteboard with custom controls
const WhiteboardWithControls = () => (
  <div className="whiteboard-container">
    <WhiteboardRenderer
      component={{
        id: "whiteboard-2",
        props: {
          backgroundColor: "#ffffff",
          strokeColor: "#000000"
        }
      }}
    />
    <WhiteboardControls
      componentId="whiteboard-2"
    />
  </div>
)`}
          </pre>
        </div>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Use appropriate tool sizes for different drawing needs</li>
          <li>Implement regular auto-saving for work preservation</li>
          <li>Consider touch device support for mobile usage</li>
          <li>Maintain consistent stroke styles for professional appearance</li>
          <li>Use shape tools for precise geometric elements</li>
        </ul>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Common Issues</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Drawing not appearing:</strong>
                <p>Ensure view mode is enabled and the canvas has proper dimensions.</p>
              </li>
              <li>
                <strong>Touch events not working:</strong>
                <p>Check touchAction settings and ensure proper event handling.</p>
              </li>
              <li>
                <strong>History not updating:</strong>
                <p>Verify that saveToHistory is being called after drawing operations.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="performance" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Performance Considerations</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Optimization Tips</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use appropriate canvas dimensions</li>
              <li>Implement debounced auto-save</li>
              <li>Optimize image uploads before rendering</li>
              <li>Use React.memo for component memoization</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhiteboardDocs; 