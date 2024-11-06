import React from 'react';

const KanbanDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Kanban component provides a flexible and interactive board system for task management.
          It supports drag-and-drop functionality, customizable columns, task creation, and integration
          with Todo lists for comprehensive project management.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Drag-and-drop task management</li>
          <li>Customizable columns with reordering capability</li>
          <li>Task cards with color customization</li>
          <li>Todo list integration and progress tracking</li>
          <li>Task duration tracking per column and overall</li>
          <li>Comments system for task collaboration</li>
        </ul>
      </section>

      <section id="column-management" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Column Management</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Column Controls</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Add new columns with custom titles</li>
          <li>Drag-and-drop reordering of columns</li>
          <li>Delete existing columns</li>
          <li>Customize column background colors</li>
          <li>Link column styles for consistent appearance</li>
        </ul>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-medium mb-2">Style Linking:</h4>
          <p className="text-gray-700">
            Use the chain icon to link column styles. When enabled, color changes will apply to all columns simultaneously,
            maintaining visual consistency across the board.
          </p>
        </div>
      </section>

      <section id="task-management" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Task Management</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Creating Tasks</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Double-click on any column to create a new task</li>
          <li>Set task title, description, and color</li>
          <li>Link tasks to Todo lists for progress tracking</li>
          <li>Add comments for collaboration</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Task Features</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Drag-and-drop between columns</li>
          <li>Color customization for visual organization</li>
          <li>Duration tracking in each column</li>
          <li>Total task duration tracking</li>
          <li>Todo list progress display</li>
        </ul>
      </section>

      <section id="todo-integration" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Todo List Integration</h2>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">Linking Tasks with Todo Lists:</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Create or select a task in your Kanban board</li>
            <li>Open the task details modal</li>
            <li>Use the "Linked Todo List" dropdown to select a Todo list</li>
            <li>The task card will now display progress from the linked Todo list</li>
          </ol>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Progress Tracking</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Automatic progress calculation (completed/total tasks)</li>
          <li>Real-time progress updates</li>
          <li>Visual progress indicator on task cards</li>
        </ul>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Use consistent column colors for better visual organization</li>
          <li>Link related tasks to Todo lists for detailed progress tracking</li>
          <li>Utilize task colors to indicate priority or category</li>
          <li>Regularly review task durations in columns to identify bottlenecks</li>
          <li>Use comments for team communication and task updates</li>
        </ul>
      </section>

      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Kanban Setup</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
{`const MyKanban = () => (
  <KanbanRenderer
    component={{
      props: {
        columns: [
          { id: 'col1', title: 'To Do' },
          { id: 'col2', title: 'In Progress' },
          { id: 'col3', title: 'Done' }
        ]
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Linking with Todo List</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
{`// Create a task with a linked Todo list
const task = {
  title: 'Project Setup',
  description: 'Initial project configuration',
  linkedTodoList: 'todo-list-id'
};

// The task will automatically display progress from the linked Todo list`}
          </pre>
        </div>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Common Issues</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Tasks not dragging:</strong>
                <p>Ensure the board is in interactive mode and you have proper permissions.</p>
              </li>
              <li>
                <strong>Todo list progress not updating:</strong>
                <p>Verify that the Todo list ID is correct and the list exists in your project.</p>
              </li>
              <li>
                <strong>Column styles not syncing:</strong>
                <p>Check if the style linking feature is enabled (chain icon in controls).</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="performance" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Performance Considerations</h2>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Large Boards:</strong>
              <p>For boards with many tasks, consider implementing pagination or virtual scrolling.</p>
            </li>
            <li>
              <strong>Todo List Integration:</strong>
              <p>Link Todo lists only when necessary, as each linked list requires additional data fetching.</p>
            </li>
            <li>
              <strong>Comments:</strong>
              <p>Comments are loaded on-demand when viewing task details to improve initial load time.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default KanbanDocs; 