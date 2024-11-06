import React from 'react';

const TodoDocs = () => {
  return (
    <div className="flex-1">
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Todo component provides a flexible task management system that can work independently or integrate with the Kanban board.
          It offers real-time task tracking, completion status, and customizable styling options.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Interactive task management with checkbox controls</li>
          <li>Real-time completion tracking and percentage display</li>
          <li>Double-tap/click task editing</li>
          <li>Kanban board integration capabilities</li>
          <li>Customizable styling for both list and individual tasks</li>
          <li>Persistent data storage across sessions</li>
        </ul>
      </section>

      <section id="task-management" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Adding Tasks</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Click the '+' button in the top-right corner</li>
          <li>Enter task name and optional description</li>
          <li>Tasks are automatically saved to the system</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Editing Tasks</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Double-tap/click on any task to open edit modal</li>
          <li>Modify task name and description</li>
          <li>Changes are saved automatically</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Task Completion</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Toggle checkbox to mark tasks as complete</li>
          <li>Completed tasks show strike-through styling</li>
          <li>Progress tracker shows completion percentage</li>
        </ul>
      </section>

      <section id="kanban-integration" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Kanban Integration</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Integration Features:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Todo lists can be linked to Kanban cards</li>
            <li>Progress is automatically reflected in Kanban cards</li>
            <li>Multiple todo lists can be linked to different cards</li>
          </ul>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Linking Process</h3>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Create a Todo list component</li>
          <li>Open a Kanban card (new or existing)</li>
          <li>Select the Todo list from the "Linked Todo List" dropdown</li>
          <li>The card will now display the Todo list's completion status</li>
        </ol>
      </section>

      <section id="styling-options" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Title Customization</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Font properties (size, family, weight, style)</li>
          <li>Text color and decoration</li>
          <li>Underline accent color</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Task Styling</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Background color for individual tasks</li>
          <li>Text styling for task names</li>
          <li>Completed task appearance</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Control Elements</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Add button color and background</li>
          <li>Checkbox appearance</li>
          <li>Progress indicator styling</li>
        </ul>
      </section>

      <section id="code-examples" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
        
        <h3 className="text-xl font-medium mt-6 mb-3">Basic Todo List</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <pre className="text-sm overflow-x-auto">
            {`// Basic todo list implementation
const MyTodoList = () => (
  <TodoRenderer
    component={{
      props: {
        title: "My Tasks",
        tasks: []
      },
      style: {
        backgroundColor: "#f9f9f9",
        accentColor: "#4a90e2"
      }
    }}
  />
)`}
          </pre>
        </div>

        <h3 className="text-xl font-medium mt-6 mb-3">Kanban Integration</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {`// Linking todo list to Kanban card
const linkedTodoId = "todo-123";
const kanbanCard = {
  title: "Project Tasks",
  linkedTodoList: linkedTodoId,
  // ... other card properties
};`}
          </pre>
        </div>
      </section>

      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Keep task names concise and clear</li>
          <li>Use descriptions for additional details</li>
          <li>Link related tasks to Kanban cards for better organization</li>
          <li>Regularly update task status to maintain accurate progress tracking</li>
          <li>Use consistent styling across related todo lists</li>
        </ul>
      </section>

      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl font-medium mt-6 mb-3">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Task not appearing in Kanban card:</strong>
              Ensure that the Todo list is correctly linked to the Kanban card.
              If the task is not appearing, check the "Linked Todo List" dropdown for the correct Todo list.
            </li>
            <li>
              <strong>Task not saving:</strong>
              Ensure that the task name and description are correctly entered.
              If the task is not saving, check the input fields for any errors.
            </li>
            <li>
              <strong>Task not completing:</strong>
              Ensure that the task is correctly marked as complete.
              If the task is not completing, check the checkbox for the task.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default TodoDocs; 