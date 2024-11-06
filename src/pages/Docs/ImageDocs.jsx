import React from 'react';

const ImageDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Image component system provides a flexible way to handle both regular images and SVG files.
          It automatically detects the content type and renders the appropriate component with its specific controls.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Automatic SVG detection and specialized rendering</li>
          <li>Support for both image uploads and SVG code paste</li>
          <li>Comprehensive image controls (zoom, position, fit mode)</li>
          <li>Advanced SVG manipulation (colors, stroke, scale)</li>
          <li>Responsive design with various fit modes</li>
        </ul>
      </section>

      {/* Image Controls Section */}
      <section id="image-controls" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Image Controls</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Upload Options</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Image Upload: Supports common image formats (PNG, JPG, etc.)</li>
          <li>SVG Upload: Direct file upload or paste SVG code</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Zoom Controls</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Scale range: 0.1x to 3x</li>
          <li>Interactive slider with +/- buttons</li>
          <li>Maintains aspect ratio while scaling</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Position Controls</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>X and Y position adjustment (0-100%)</li>
          <li>Active when image is zoomed in or using 'Cover' fit mode</li>
          <li>Helps with image composition within container</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Fit Modes</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Cover: Fills container, may crop image</li>
          <li>Contain: Shows entire image, may leave space</li>
          <li>Fill: Stretches to fill container</li>
          <li>None: Original size</li>
        </ul>
      </section>

      {/* SVG Controls Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">SVG Controls</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Size vs Scale</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Important Distinction:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Size (Width/Height):</strong> Controls the SVG container dimensions and layout space</li>
            <li><strong>Scale:</strong> Zooms the SVG content within its container without affecting layout</li>
          </ul>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Color Controls</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Fill Color: Changes the internal color of SVG shapes</li>
          <li>Stroke Color: Modifies the outline color</li>
          <li>Stroke Width: Adjusts outline thickness</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Transformation Controls</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Rotation: 360-degree rotation control</li>
          <li>Center Button: Resets SVG position to center</li>
          <li>Scale: Adjustable from 0.1x to 3x</li>
        </ul>
      </section>

      {/* Best Practices Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Use SVG format for icons and logos for better scaling</li>
          <li>Choose appropriate fit modes based on image content</li>
          <li>Consider container size when setting image dimensions</li>
          <li>Use scale for temporary zoom effects, size for permanent dimensions</li>
          <li>Ensure SVGs have proper viewBox attributes for best rendering</li>
        </ul>
      </section>

      {/* Technical Details Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Component Structure</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><code>ImageRenderer</code>: Main component for images and SVG detection</li>
            <li><code>SvgRenderer</code>: Specialized SVG rendering and manipulation</li>
            <li><code>ImageControls</code>: UI controls for regular images</li>
            <li><code>SvgControls</code>: Specialized controls for SVG manipulation</li>
          </ul>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Image Implementation</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Basic image with default settings
const MyImage = () => (
  <ImageRenderer
    component={{
      content: "https://example.com/image.jpg",
      style: {
        width: "200px",
        height: "200px"
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">SVG with Custom Styling</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// SVG with custom colors and scaling
const MySvg = () => (
  <SvgRenderer
    component={{
      content: '<svg>...</svg>',
      style: {
        fill: "#FF0000",
        stroke: "#000000",
        scale: 1.5
      }
    }}
  />
)`}
          </pre>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Common Issues</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>SVG not scaling properly:</strong>
                <p>Ensure the SVG has a proper viewBox attribute and check if width/height attributes are interfering with scaling.</p>
              </li>
              <li>
                <strong>Image position not updating:</strong>
                <p>Position controls only work when scale {'>'} 1 or using 'cover' fit mode.</p>
              </li>
              <li>
                <strong>Colors not applying to SVG:</strong>
                <p>Some SVGs may have hard-coded colors. Try removing fill/stroke attributes from the SVG code.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Performance Optimization Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Performance Tips</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Image Optimization</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use appropriate image sizes - don't load large images for small displays</li>
              <li>Consider using WebP format for better compression</li>
              <li>Implement lazy loading for images below the fold</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">SVG Optimization</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Minimize SVG code using tools like SVGO</li>
              <li>Remove unnecessary attributes and metadata</li>
              <li>Use symbols for repeated SVG elements</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Considerations</h2>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Alt Text:</strong>
              <p>Always provide meaningful alt text for images through the props.alt property</p>
            </li>
            <li>
              <strong>ARIA Labels:</strong>
              <p>Use aria-label for SVGs that convey meaning</p>
            </li>
            <li>
              <strong>Color Contrast:</strong>
              <p>Ensure sufficient contrast for SVG elements, especially for icons and text</p>
            </li>
            <li>
              <strong>Keyboard Navigation:</strong>
              <p>Implement keyboard controls for interactive images</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Advanced Usage Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Advanced Usage</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Custom Transformations</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Example of complex SVG transformation
const ComplexSvg = () => (
  <SvgRenderer
    component={{
      content: '<svg>...</svg>',
      style: {
        transform: 'rotate(45deg) scale(1.5)',
        transformOrigin: 'center',
        transition: 'transform 0.3s ease'
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Dynamic Updates</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`// Example of dynamic style updates
const DynamicImage = () => {
  const [scale, setScale] = useState(1);
  
  const handleZoom = (newScale) => {
    setScale(newScale);
    onStyleChange({
      style: { scale: newScale }
    });
  };

  return (
    <ImageRenderer
      component={{
        style: { scale }
      }}
      onUpdate={handleZoom}
    />
  );
}`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default ImageDocs;
