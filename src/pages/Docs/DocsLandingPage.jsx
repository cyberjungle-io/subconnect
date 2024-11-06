import React from 'react';
import { Link } from 'react-router-dom';

const DocsLanding = () => {
  return (
    <div className="max-w-4xl">
      <section id="welcome" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Welcome to the Documentation</h2>
        <p className="text-gray-700 mb-6">
          Explore our comprehensive documentation to learn how to use and customize components
          for building interactive dashboards and data visualizations.
        </p>
      </section>

      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Core Components</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Start with <Link to="/docs/components/flex-container" className="text-blue-600 hover:underline">Flex Container</Link> for layouts</li>
              <li>• Add <Link to="/docs/components/text" className="text-blue-600 hover:underline">Text</Link> and <Link to="/docs/components/image" className="text-blue-600 hover:underline">Images</Link></li>
              <li>• Explore data visualization with <Link to="/docs/components/charts" className="text-blue-600 hover:underline">Charts</Link></li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Project Management</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Organize tasks with <Link to="/docs/components/kanban" className="text-blue-600 hover:underline">Kanban Boards</Link></li>
              <li>• Track progress using <Link to="/docs/components/todo" className="text-blue-600 hover:underline">Todo Lists</Link></li>
              <li>• Display data in <Link to="/docs/components/table" className="text-blue-600 hover:underline">Tables</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="guides" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Essential Guides</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Recommended Reading</h3>
          <p className="text-gray-700 mb-4">
            Start with our guide on <Link to="/docs/guides/responsive-design" className="text-blue-600 hover:underline">Responsive Design</Link> to
            learn how to create layouts that work across all device sizes.
          </p>
          <div className="text-sm text-gray-600">
            More guides coming soon...
          </div>
        </div>
      </section>

      <section id="help" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
        <p className="text-gray-700">
          Each component documentation includes code examples, best practices, and troubleshooting guides.
          Select a topic from the sidebar to dive deeper into specific components and features.
        </p>
      </section>
    </div>
  );
};

export default DocsLanding;
