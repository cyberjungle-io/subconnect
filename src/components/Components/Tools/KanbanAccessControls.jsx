import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { grantUserAccess } from '../../../features/userSlice';
import { w3sService } from '../../../w3s/w3sService';

const KanbanAccessControls = ({ props, onClose }) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [permissions, setPermissions] = useState({
    add: true,
    modify: false,
    move: false,
    assign_tasks: false,
  });
  const dispatch = useDispatch();

  // Get project users from currentProject
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const projectUsers = currentProject?.access_records || [];

  // Effect to load current permissions when user is selected
  useEffect(() => {
    const loadUserPermissions = async () => {
      if (!selectedUserId || !props.id) return;

      try {
        // Get the component-specific access record
        const componentAccess = await w3sService.getAccessesByLinkId(props.id);
        console.log("Component access records:", componentAccess);

        // Find this user's access record
        const userAccess = componentAccess?.find(access => access.user_id === selectedUserId);
        console.log("Found user component access:", userAccess);

        if (userAccess && userAccess.ui_permissions) {
          // Convert array of permissions back to object format
          const newPermissions = {
            add: userAccess.ui_permissions.includes('add'),
            modify: userAccess.ui_permissions.includes('modify'),
            move: userAccess.ui_permissions.includes('move'),
            assign_tasks: userAccess.ui_permissions.includes('assign_tasks'),
          };
          setPermissions(newPermissions);
        } else {
          // Reset to defaults if no existing permissions
          setPermissions({
            add: true,
            modify: false,
            move: false,
            assign_tasks: false,
          });
        }
      } catch (error) {
        console.error("Failed to load user permissions:", error);
        // Reset to defaults on error
        setPermissions({
          add: true,
          modify: false,
          move: false,
          assign_tasks: false,
        });
      }
    };

    loadUserPermissions();
  }, [selectedUserId, props.id]);

  // Helper function to safely get user display text
  const getUserDisplayText = (user) => {
    const username = user.user_details?.username || user.user_id || "Unknown User";
    const email = user.user_details?.email ? ` (${user.user_details.email})` : "";
    return `${username}${email}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedUser = projectUsers.find(
      (user) => user.user_id === selectedUserId
    );
    if (!selectedUser) return;

    try {
      // Get existing access records for this component
      const componentAccess = await w3sService.getAccessesByLinkId(props.id);
      const existingAccess = componentAccess?.find(access => access.user_id === selectedUserId);

      // Convert permissions to array
      const permissionArray = Object.entries(permissions)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([permission]) => permission);

      // Create complete access record
      const accessRecord = {
        link_id: props.id,
        project_id: currentProject._id,
        user_id: selectedUser.user_id,
        user_details: selectedUser.user_details || {},
        ui_permissions: permissionArray,
        backend_permissions: selectedUser.backend_permissions,
        status: "active",
        type: "kanban",
        created_at: existingAccess?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Granting access with record:", accessRecord);
      await dispatch(grantUserAccess(accessRecord)).unwrap();
      setSelectedUserId("");
      setPermissions({ add: true, modify: false, move: false, assign_tasks: false });
    } catch (error) {
      console.error("Grant access failed:", error);
    }
  };

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Access Controls</h3>
      <div className="control-section-content">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a user...</option>
              {projectUsers.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {getUserDisplayText(user)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.add}
                  onChange={(e) => setPermissions(prev => ({ ...prev, add: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Add Tasks</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.modify}
                  onChange={(e) => setPermissions(prev => ({ ...prev, modify: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Modify Tasks</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.move}
                  onChange={(e) => setPermissions(prev => ({ ...prev, move: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Move Tasks</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.assign_tasks}
                  onChange={(e) => setPermissions(prev => ({ ...prev, assign_tasks: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Assign Tasks</span>
              </label>
            </div>
          </div>

          {selectedUserId && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Current Project Permissions
              </h4>
              <div className="flex flex-wrap gap-1">
                {projectUsers
                  .find((user) => user.user_id === selectedUserId)
                  ?.backend_permissions?.map((perm) => (
                    <span
                      key={perm}
                      className="inline-block bg-gray-200 rounded px-2 py-1 text-xs text-gray-700"
                    >
                      {perm}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedUserId}
          >
            Grant Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default KanbanAccessControls; 