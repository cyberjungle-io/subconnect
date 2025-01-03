import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTrash, FaArrowLeft, FaUser, FaFile, FaEllipsisV, FaEdit, FaChevronRight, FaChevronDown, FaPlus } from 'react-icons/fa';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';

const ComponentItem = ({ component, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = component.children && component.children.length > 0;

  return (
    <>
      <li className={`
        px-4 py-3 
        flex items-start justify-between 
        hover:bg-gray-50 
        ${depth > 0 ? 'bg-gray-50 border-l-2 border-indigo-200' : ''}
        transition-colors duration-200
      `}>
        <div className="flex items-start flex-grow min-w-0" style={{ paddingLeft: `${depth * 20}px` }}>
          <div className="flex-shrink-0 mt-1">
            {hasChildren ? (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
              </button>
            ) : (
              <div className="w-4 mr-2" />
            )}
          </div>
          <div className="min-w-0 flex-grow">
            <div className="flex flex-wrap gap-1">
              <span className={`
                text-gray-700 font-medium truncate
                ${depth > 0 ? 'text-sm' : ''}
              `}>
                {component.name || component.type}
              </span>
              <span className={`
                text-gray-500 whitespace-nowrap
                ${depth > 0 ? 'text-xs' : 'text-sm'}
              `}>
                ({component.type})
              </span>
            </div>
          </div>
        </div>
        {hasChildren && (
          <div className="flex-shrink-0 ml-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {component.children.length} {component.children.length === 1 ? 'child' : 'children'}
            </span>
          </div>
        )}
      </li>
      {hasChildren && isExpanded && (
        <ul className="divide-y divide-gray-200">
          {component.children.map((child, index) => (
            <ComponentItem 
              key={child.id || index} 
              component={child} 
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </>
  );
};

const ProjectDetailView = ({ 
  project, 
  initialPage = null, 
  onBack, 
  onAddUser, 
  onDelete, 
  onUpdatePage, 
  onDeletePage,
  onCreatePage 
}) => {
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);

  // Initialize selectedPage when initialPage changes
  useEffect(() => {
    if (initialPage) {
      setSelectedPage(initialPage);
    }
  }, [initialPage]);

  const handlePageSettings = (page, e) => {
    e.stopPropagation();
    setSelectedPage(page);
  };

  const handleSavePage = (updatedPage) => {
    onUpdatePage?.(updatedPage);
    setSelectedPage(null);
  };

  const handleDeletePageClick = () => {
    setDeleteType('page');
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'page') {
      onDeletePage?.(selectedPage);
      setSelectedPage(null);
    } else if (deleteType === 'project') {
      onDelete?.(project._id);
    }
    setDeleteModalOpen(false);
  };

  const handleDeleteProjectClick = () => {
    setDeleteType('project');
    setDeleteModalOpen(true);
  };

  const getDeleteModalConfig = () => {
    if (deleteType === 'page') {
      return {
        title: 'Delete Page',
        message: `Are you sure you want to delete the page "${selectedPage?.name}"? This action cannot be undone.`
      };
    }
    return {
      title: 'Delete Project',
      message: `Are you sure you want to delete the project "${project?.name}"? This action cannot be undone.`
    };
  };

  // Page Settings View
  if (selectedPage) {
    return (
      <>
        <div className="p-6 flex flex-col min-h-full">
          <div className="space-y-4 mb-6">
            <div className="flex items-center group">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={selectedPage.name}
                  onChange={(e) => setSelectedPage({ ...selectedPage, name: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  className="text-xl font-semibold text-gray-900 bg-transparent border-none p-0 w-full focus:outline-none focus:ring-0"
                  placeholder="Page Name"
                />
              ) : (
                <h3 className="text-xl font-semibold text-gray-900">{selectedPage.name}</h3>
              )}
              <button
                onClick={() => setIsEditingTitle(true)}
                className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <FaEdit size={14} />
              </button>
            </div>

            <div className="flex items-start group">
              {isEditingDescription ? (
                <textarea
                  value={selectedPage.description || ''}
                  onChange={(e) => setSelectedPage({ ...selectedPage, description: e.target.value })}
                  onBlur={() => setIsEditingDescription(false)}
                  autoFocus
                  placeholder="Add a description..."
                  className="w-full text-gray-600 bg-transparent border-none p-0 resize-none focus:outline-none focus:ring-0"
                  rows={2}
                />
              ) : (
                <p className="text-gray-600">
                  {selectedPage.description || 'No description'}
                </p>
              )}
              <button
                onClick={() => setIsEditingDescription(true)}
                className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1"
              >
                <FaEdit size={14} />
              </button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            {/* Users Section */}
            <div>
              <div className="border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-t-lg border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaUser className="mr-2 text-gray-600" /> Users
                  </h4>
                  <button
                    onClick={() => onAddUser(project._id)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    title="Add User"
                  >
                    <FaUserPlus className="text-xl" />
                  </button>
                </div>
                <div className="bg-white rounded-b-lg">
                  <p className="px-4 py-3 text-gray-500">No users added to this page yet.</p>
                </div>
              </div>
            </div>

            {/* Components Section */}
            <div>
              <div className="border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-t-lg border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaFile className="mr-2 text-gray-600" /> Components
                  </h4>
                </div>
                <div className="bg-white rounded-b-lg">
                  {selectedPage.content?.components && selectedPage.content.components.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {selectedPage.content.components.map((component, index) => (
                        <ComponentItem 
                          key={component.id || index} 
                          component={component}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-gray-500">No components in this page yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delete Page Button */}
          <div className="flex justify-end mt-auto pt-6">
            <button
              onClick={handleDeletePageClick}
              className="flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded transition-colors duration-200"
            >
              <FaTrash className="mr-2" />
              Delete Page
            </button>
          </div>
        </div>

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteConfirm}
          {...getDeleteModalConfig()}
        />
      </>
    );
  }

  // Project Detail View
  return (
    <>
      <div className="p-6 flex flex-col min-h-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{project.name}</h3>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
          {/* Users Section */}
          <div>
            <div className="border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-t-lg border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaUser className="mr-2 text-gray-600" /> Users
                </h4>
                <button
                  onClick={() => onAddUser(project._id)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Add User"
                >
                  <FaUserPlus className="text-xl" />
                </button>
              </div>
              <div className="bg-white rounded-b-lg">
                <ul className="divide-y divide-gray-200">
                  {/* Project Owner */}
                  <li className="px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-700">
                      {project.creatorUsername || 'Unknown Owner'}
                    </span>
                    <span className="text-sm font-medium text-blue-600">Owner</span>
                  </li>
                  
                  {/* Other Users */}
                  {project.access_records?.map((record, index) => (
                    <li key={index} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-gray-700">{record.user_details.email}</span>
                      <span className="text-sm text-gray-500">Member</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pages Section */}
          <div>
            <div className="border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-t-lg border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaFile className="mr-2 text-gray-600" /> Pages
                </h4>
                <button
                  onClick={onCreatePage}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Add Page"
                >
                  <FaPlus className="text-xl" />
                </button>
              </div>
              <div className="bg-white rounded-b-lg">
                {project.pages && project.pages.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {project.pages.map((page, index) => (
                      <li key={index} className="px-4 py-3 flex items-center justify-between">
                        <span className="text-gray-700">{page.name}</span>
                        <button
                          onClick={(e) => handlePageSettings(page, e)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          <FaEllipsisV />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-gray-500">No pages in this project yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Project Button */}
        <div className="flex justify-end mt-auto pt-6">
          <button
            onClick={handleDeleteProjectClick}
            className="flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded transition-colors duration-200"
          >
            <FaTrash className="mr-2" />
            Delete Project
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
        {...getDeleteModalConfig()}
      />
    </>
  );
};

export default ProjectDetailView; 