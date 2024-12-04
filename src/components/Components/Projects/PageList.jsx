import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProject } from "../../../w3s/w3sSlice";
import { FaPlus, FaCheck, FaTimes, FaEllipsisV } from "react-icons/fa";
import ProjectModal from "./ProjectModal";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";

const PageList = ({
  projectId,
  selectedPageId,
  onSelectPage,
  onDeletePage,
  toolbarSettings,
}) => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modalView, setModalView] = useState('detail');

  // Create a style tag for dynamic hover effect and selected page
  useEffect(() => {
    const style = document.createElement('style');
    const hoverColor = toolbarSettings.buttonHoverColor || '#d0d0d0';
    style.innerHTML = `
      .page-list-item:not(.selected):hover {
        color: ${hoverColor} !important;
      }
      .page-list-item.selected {
        background-color: ${hoverColor} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [toolbarSettings.buttonHoverColor]);

  const handleNewPage = () => {
    setSelectedPage(null);
    setModalView('create-page');
    setIsProjectModalOpen(true);
  };

  const handleSettingsClick = (e, page) => {
    e.stopPropagation();
    setSelectedPage(page);
    setModalView('detail');
    setIsProjectModalOpen(true);
  };

  if (!currentProject) return <div>No project selected</div>;

  return (
    <div className="page-list" style={{ 
      color: toolbarSettings.textColor,
      right: 0,
      minWidth: '250px',
      position: 'relative',
      zIndex: 9999
    }}>
      <div className="flex justify-between items-center mb-2 px-3 pt-2">
        <h3 className="text-sm font-semibold">Pages</h3>
        <button
          onClick={handleNewPage}
          className="hover:opacity-70 transition-opacity"
        >
          <FaPlus size={12} />
        </button>
      </div>
      {currentProject.pages.length === 0 ? (
        <p className="text-sm px-3" style={{ opacity: 0.7 }}>No pages found. Create a new one to get started!</p>
      ) : (
        <ul className="space-y-1 px-3 pb-2">
          {currentProject.pages.map((page, index) => (
            <li
              key={index}
              className={`page-list-item flex items-center justify-between p-2 rounded cursor-pointer transition-opacity duration-200 ${
                page._id === selectedPageId ? "selected" : ""
              }`}
              onClick={() => onSelectPage(page)}
            >
              <span className="text-sm">{page.name}</span>
              <button
                onClick={(e) => handleSettingsClick(e, page)}
                className="hover:opacity-70 transition-opacity px-2"
              >
                <FaEllipsisV size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedPage(null);
          setModalView('detail');
        }}
        initialView={modalView}
        initialProject={currentProject}
        initialPage={selectedPage}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onDelete={() => {
          setDeleteConfirmOpen(false);
          setIsProjectModalOpen(false);
        }}
        title="Delete Page"
        message="Are you sure you want to delete this page? This action cannot be undone."
      />
    </div>
  );
};

export default PageList;
