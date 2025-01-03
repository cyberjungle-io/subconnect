import React, { useState, useEffect } from 'react';
import CommentsSection from './CommentsSection';
import DeleteConfirmModal from './DeleteConfirmModal';

const KanBanTaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete, 
  task, 
  isReadOnly,
  accessRecord,
  currentUser,
  currentProject
}) => {
  // console.log("KanBanTaskModal props:", {
  //   accessRecord,
  //   currentUser,
  //   currentProject,
  //   isReadOnly,
  //   task
  // });
  console.log("Access Record:", accessRecord);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignToList, setAssignToList] = useState([]);

  useEffect(() => {
    console.log("task state updated:", task);
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setComments(task.comments || []);
      if (task.assignedTo) {
        if (task.assignedTo.user_id) {
          setAssignedTo(task.assignedTo.user_id);
        } else {
          const userDetails = currentProject?.access_records?.find(
            record => record.user_id === task.assignedTo
          )?.user_details;
          if (userDetails) {
            setAssignedTo(task.assignedTo);
          }
        }
      } else {
        setAssignedTo(null);
      }
    } else {
      setTitle('');
      setDescription('');
      setComments([]);
      setAssignedTo(null);
    }
  }, [task, currentProject]);

  useEffect(() => {
    const list = [];
    
    // Helper function to get user display name
    const getUserDisplayName = (record) => {
      // Try to get username from user_details
      if (record.user_details) {
        if (record.user_details.username) return record.user_details.username;
        if (record.user_details.email) return record.user_details.email;
      }
      // Try to get from the record directly
      if (record.username) return record.username;
      if (record.email) return record.email;
      return 'Unknown User';
    };

    // Add users from project access records
    if (currentProject?.access_records) {
      currentProject.access_records.forEach(record => {
        // Only add if not already in list (avoid duplicates)
        if (!list.some(user => user.user_id === record.user_id)) {
          list.push({
            user_id: record.user_id,
            user_name: getUserDisplayName(record)
          });
        }
      });
    }

    // Add users from component access records if they exist
    if (accessRecord?.access_records) {
      accessRecord.access_records.forEach(record => {
        // Only add if not already in list (avoid duplicates)
        if (!list.some(user => user.user_id === record.user_id)) {
          list.push({
            user_id: record.user_id,
            user_name: getUserDisplayName(record)
          });
        }
      });
    }

    // Add project creator if not already in list
    if (currentProject?.createdBy && currentProject?.creatorUsername && 
        !list.some(user => user.user_id === currentProject.createdBy)) {
      list.push({
        user_id: currentProject.createdBy,
        user_name: currentProject.creatorUsername
      });
    }

    console.log("Project users for dropdown:", {
      projectAccessRecords: currentProject?.access_records,
      componentAccessRecords: accessRecord?.access_records,
      combinedList: list,
      currentProject
    });
    setAssignToList(list);
  }, [currentProject, accessRecord]);

  // Add new useEffect to monitor assignToList changes
  useEffect(() => {
    // console.log("assignToList state updated:", assignToList);
  }, [assignToList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isReadOnly) {
      const assignedUser = assignedTo ? assignToList.find(user => user.user_id === assignedTo) : null;
      const currentUserDetails = assignToList.find(user => user.user_id === currentUser?._id);

      const updatedTask = {
        ...task,
        title,
        description,
        comments,
        assignedTo: assignedUser ? {
          user_id: assignedUser.user_id,
          user_name: assignedUser.user_name
        } : null,
      };

      // If assignment changed, add a comment
      if (task && (task.assignedTo?.user_id !== assignedTo)) {
        const comment = generateAssignmentComment(task.assignedTo?.user_id, assignedTo, currentUser?._id);
        if (comment) {
          updatedTask.comments = [...comments, {
            id: Date.now().toString(),
            text: comment,
            createdAt: new Date().toISOString(),
            createdBy: currentUser?._id,
            type: 'system'
          }];
          updatedTask.assignedBy = currentUserDetails ? {
            user_id: currentUserDetails.user_id,
            user_name: currentUserDetails.user_name
          } : {
            user_id: currentUser?._id,
            user_name: currentUser?.username || currentUser?.email || 'Unknown User'
          };
          updatedTask.assignedAt = new Date().toISOString();
        }
      }

      onSubmit(updatedTask);
    }
  };

  const generateAssignmentComment = (oldAssigneeId, newAssigneeId, assignerId) => {
    if (!newAssigneeId && !oldAssigneeId) return null;
    
    const getUsername = (userId) => {
      const user = assignToList.find(u => u.user_id === userId);
      return user ? user.user_name : 'Unknown User';
    };
    
    if (!oldAssigneeId && newAssigneeId) {
      return newAssigneeId === assignerId 
        ? `Task self-assigned by @${getUsername(assignerId)}`
        : `Task assigned to @${getUsername(newAssigneeId)} by @${getUsername(assignerId)}`;
    }
    
    if (oldAssigneeId && !newAssigneeId) {
      return `Task unassigned from @${getUsername(oldAssigneeId)} by @${getUsername(assignerId)}`;
    }
    
    return `Task reassigned from @${getUsername(oldAssigneeId)} to @${getUsername(newAssigneeId)} by @${getUsername(assignerId)}`;
  };

  const handleAddComment = (newComment) => {
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    onSubmit({
      ...task,
      title,
      description,
      comments: updatedComments,
      assignedTo
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task);
    setIsDeleteModalOpen(false);
  };

  const canAssignOthers = () => {
    // console.log("Checking assign others permission:", {
    //   permissions: accessRecord?.ui_permissions,
    //   hasAssignPermission: accessRecord?.ui_permissions?.includes('assign_tasks'),
    //   isOwner: accessRecord?.backend_permissions?.includes('admin'),
    //   isProjectOwner: currentProject?.createdBy === currentUser?._id
    // });
    
    // Allow if user is project owner, admin, or has assign_tasks permission
    return currentProject?.createdBy === currentUser?._id || 
           accessRecord?.backend_permissions?.includes('admin') || 
           accessRecord?.ui_permissions?.includes('assign_tasks');
  };

  const canSelfAssign = () => {
    // console.log("Checking self assign capability:", {
    //   isReadOnly,
    //   currentUser,
    //   currentUserId: currentUser?._id,
    //   isOwner: accessRecord?.backend_permissions?.includes('admin'),
    //   isProjectOwner: currentProject?.createdBy === currentUser?._id
    // });
    
    // Always allow self-assign for project owners or admins, otherwise check if not readonly and user exists
    return currentProject?.createdBy === currentUser?._id ||
           accessRecord?.backend_permissions?.includes('admin') || 
           (!isReadOnly && currentUser?._id);
  };

  if (!isOpen) return null;

  // console.log("Rendering dropdown with assignToList:", assignToList);
  // console.log("Current permissions:", {
  //   canAssignOthers: canAssignOthers(),
  //   canSelfAssign: canSelfAssign(),
  //   currentUserId: currentUser?._id
  // });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
         style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl" 
           style={{ position: 'relative' }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task title"
              disabled={isReadOnly}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task description"
              rows="3"
              disabled={isReadOnly}
            />
          </div>

          {/* Assignment Section */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assigned To
            </label>
            <select
              value={assignedTo || ''}
              onChange={(e) => setAssignedTo(e.target.value || null)}
              className="w-full p-2 border rounded"
              disabled={isReadOnly || (!canAssignOthers() && !canSelfAssign())}
            >
              <option value="">Unassigned</option>
              {assignToList.map(user => {
                const shouldShow = canAssignOthers() || (canSelfAssign() && user.user_id === currentUser?._id);
                // console.log("Dropdown item:", { user, shouldShow, canAssignOthers: canAssignOthers() });
                
                if (shouldShow) {
                  return (
                    <option key={user.user_id} value={user.user_id}>
                      {user.user_name}
                    </option>
                  );
                }
                return null;
              })}
            </select>
            {(!canAssignOthers() && !canSelfAssign()) && (
              <p className="text-sm text-gray-500 mt-1">
                You don't have permission to assign tasks
              </p>
            )}
            {(canSelfAssign() && !canAssignOthers()) && (
              <p className="text-sm text-gray-500 mt-1">
                You can only assign tasks to yourself
              </p>
            )}
          </div>
          
          {task && (
            <CommentsSection
              taskId={task.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          )}

          <div className="flex justify-between items-center gap-2 mt-4">
            {task && !isReadOnly && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Task
              </button>
            )}
            
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              {!isReadOnly && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {task ? 'Update' : 'Create'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default KanBanTaskModal;
