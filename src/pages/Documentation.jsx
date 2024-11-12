import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Toolbar from '../components/Editor/Toolbar';

// New component for the "On this page" sidebar
const PageNavigation = () => {
  const [sections, setSections] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Find all section headings when the page changes
    const headings = document.querySelectorAll('section[id] > h2');
    const newSections = Array.from(headings).map(heading => ({
      id: heading.parentElement.id,
      title: heading.textContent
    }));
    setSections(newSections);
  }, [location]); // Re-run when the route changes

  if (sections.length === 0) return null;

  return (
    <div className="w-64 shrink-0 relative">
      <div className="fixed w-64">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">On this page</h2>
          <nav className="space-y-1">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

const DocumentationPage = () => {
  const location = useLocation();
  const sections = [
    {
      title: 'Components',
      items: [
        { name: 'Flex Container', path: '/docs/components/flex-container' },
        { name: 'Image & SVG', path: '/docs/components/image' },
        { name: 'Text', path: '/docs/components/text' },
        { name: 'Charts', path: '/docs/components/charts' },
        { name: 'Kanban Board', path: '/docs/components/kanban' },
        { name: 'Todo List', path: '/docs/components/todo' },
        { name: 'Video', path: '/docs/components/video' },
        { name: 'Whiteboard', path: '/docs/components/whiteboard' },
        { name: 'Table', path: '/docs/components/table' },
        { name: 'Query Value', path: '/docs/components/query-value' },
      ]
    },
    {
      title: 'Guides',
      items: [
        { name: 'Responsive Design', path: '/docs/guides/responsive-design' },
        // Add more guides here as they come
      ]
    },
    {
      title: 'Legal',
      items: [
        { name: 'Terms of Service', path: '/docs/legal/terms' },
        { name: 'Privacy Policy', path: '/docs/legal/privacy' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toolbar />
      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-gray-200 bg-white">
          <div className="p-6">
            <Link to="/docs" className="text-xl font-bold text-gray-900">
              Documentation
            </Link>
          </div>
          <nav className="px-4 py-2">
            {sections.map((section) => (
              <div key={section.title} className="mb-8">
                <h2 className="px-2 mb-3 text-base font-bold text-gray-800 uppercase tracking-wide">
                  {section.title}
                </h2>
                <ul className="space-y-1 pl-3">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className="block px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
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
          <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {location.pathname.split('/').pop().replace(/-/g, ' ')}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-6xl flex gap-8">
              <div className="flex-1">
                <Outlet />
              </div>
              <PageNavigation />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationPage;
