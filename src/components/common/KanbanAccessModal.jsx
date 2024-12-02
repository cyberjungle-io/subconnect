import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { grantUserAccess } from '../../features/userSlice';

const KanbanAccessModal = ({ isOpen, onClose, kanbanId }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [permissions, setPermissions] = useState({
    add: true,
    modify: false,
    move: false
  });
  const dispatch = useDispatch();
  
  // Get project users from currentProject
  const currentProject = useSelector(state => state.w3s.currentProject.data);
  const projectUsers = currentProject?.access_records || [];
  
  console.log('KanbanAccessModal - Current Project:', {
    project_id: currentProject?.id,
    kanban_id: kanbanId,
    access_records: projectUsers
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedUser = projectUsers.find(user => user.user_id === selectedUserId);
    if (!selectedUser) {
      console.error('KanbanAccessModal - Selected user not found');
      return;
    }
    
    // Convert permissions to array
    const permissionArray = Object.entries(permissions)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([permission]) => permission);

    console.log('KanbanAccessModal - Selected User:', {
      user: selectedUser,
      backend_permissions: selectedUser.backend_permissions,
      project_id: currentProject._id
    });
    console.log('KanbanAccessModal - Selected Permissions:', permissionArray);

    // Create complete access record
    const accessRecord = {
      link_id: kanbanId,
      project_id: currentProject._id,
      user_id: selectedUser.user_id,
      user_details: selectedUser.user_details,
      ui_permissions: permissionArray,
      backend_permissions: selectedUser.backend_permissions,
      status: 'active',
      type: 'kanban',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('KanbanAccessModal - Complete Access Record:', accessRecord);

    try {
      const result = await dispatch(grantUserAccess(accessRecord)).unwrap();
      console.log('KanbanAccessModal - Grant access success:', result);
      onClose();
    } catch (error) {
      console.error('KanbanAccessModal - Grant access failed:', {
        error_name: error.name,
        error_message: error.message,
        response_status: error.response?.status,
        response_data: error.response?.data,
        stack: error.stack
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Grant Kanban Access</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a user...</option>
              {projectUsers.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.user_details.username} ({user.user_details.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Kanban Permissions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.add}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    console.log('KanbanAccessModal - Permission changed:', {
                      permission: 'add',
                      value: newValue
                    });
                    setPermissions(prev => ({ ...prev, add: newValue }));
                  }}
                  className="mr-2"
                />
                <span>Add Tasks</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.modify}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    console.log('KanbanAccessModal - Permission changed:', {
                      permission: 'modify',
                      value: newValue
                    });
                    setPermissions(prev => ({ ...prev, modify: newValue }));
                  }}
                  className="mr-2"
                />
                <span>Modify Tasks</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.move}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    console.log('KanbanAccessModal - Permission changed:', {
                      permission: 'move',
                      value: newValue
                    });
                    setPermissions(prev => ({ ...prev, move: newValue }));
                  }}
                  className="mr-2"
                />
                <span>Move Tasks</span>
              </label>
            </div>
          </div>

          {selectedUserId && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <h3 className="text-sm font-bold mb-2">Current Project Permissions</h3>
              <div className="text-sm">
                {projectUsers.find(user => user.user_id === selectedUserId)?.backend_permissions.map(perm => (
                  <span key={perm} className="inline-block bg-gray-200 rounded px-2 py-1 mr-2 mb-1">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!selectedUserId}
            >
              Grant Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KanbanAccessModal; 