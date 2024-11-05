import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Toolbar from '../components/Editor/Toolbar';

const DocumentationPage = () => {
  const sections = [
    {
      title: 'Components',
      items: [
        { name: 'Image & SVG', path: '/docs/components/image' },
        // Add more components here as they come
      ]
    },
    // Add more sections as needed (e.g., Guides, API, etc.)
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toolbar />
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-gray-200 bg-white">
          <div className="p-6">
            <Link to="/docs" className="text-xl font-bold text-gray-900">
              Documentation
            </Link>
          </div>
          <nav className="px-4 py-2">
            {sections.map((section) => (
              <div key={section.title} className="mb-6">
                <h2 className="px-2 mb-2 text-sm font-semibold text-gray-600 uppercase">
                  {section.title}
                </h2>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className="block px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="h-16 bg-white border-b border-gray-200">
            {/* Add breadcrumbs or other navigation aids here */}
          </div>
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationPage;
