import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProject } from "../../../w3s/w3sSlice";
import { FaPlus, FaCheck, FaTimes, FaEllipsisV } from "react-icons/fa";
import PageSettingsModal from "./PageSettingsModal";
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
  const [selectedPageSettings, setSelectedPageSettings] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

  const openNewPageModal = () => {
    setSelectedPageSettings({ page: {}, index: -1 }); // Use -1 to indicate new page
  };

  const handleDeletePage = (pageIndex) => {
    if (currentProject) {
      const updatedPages = currentProject.pages.filter((_, index) => index !== pageIndex);
      dispatch(updateProject({ ...currentProject, pages: updatedPages }));
      setSelectedPageSettings(null); // Close modal after deletion
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPageSettings) {
      handleDeletePage(selectedPageSettings.index);
      setDeleteConfirmOpen(false);
      setSelectedPageSettings(null);
    }
  };

  const handleSettingsClick = (e, page, index) => {
    e.stopPropagation();
    setSelectedPageSettings({ page, index });
  };

  const handleSavePage = (updatedPage) => {
    if (selectedPageSettings) {
      if (selectedPageSettings.index === -1) {
        // Creating new page
        const newPage = {
          ...updatedPage,
          content: {
            components: [],
            layout: {},
          },
        };
        const updatedPages = [...currentProject.pages, newPage];
        dispatch(updateProject({ ...currentProject, pages: updatedPages }));
      } else {
        // Updating existing page
        const updatedPages = [...currentProject.pages];
        updatedPages[selectedPageSettings.index] = {
          ...updatedPages[selectedPageSettings.index],
          ...updatedPage
        };
        dispatch(updateProject({ ...currentProject, pages: updatedPages }));
      }
      setSelectedPageSettings(null);
    }
  };

  if (!currentProject) return <div>No project selected</div>;

  return (
    <div className="page-list" style={{ 
      color: toolbarSettings.textColor,
      right: 0, // Ensure dropdown aligns to the right
      minWidth: '250px' // Ensure minimum width for content
    }}>
      <div className="flex justify-between items-center mb-2 px-3 pt-2">
        <h3 className="text-sm font-semibold">Pages</h3>
        <button
          onClick={openNewPageModal}
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
                onClick={(e) => handleSettingsClick(e, page, index)}
                className="hover:opacity-70 transition-opacity px-2"
              >
                <FaEllipsisV size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <PageSettingsModal
        isOpen={selectedPageSettings !== null}
        onClose={() => setSelectedPageSettings(null)}
        page={selectedPageSettings?.page}
        onDelete={handleDeleteClick}
        onSave={handleSavePage}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Page"
        message="Are you sure you want to delete this page? This action cannot be undone."
      />
    </div>
  );
};

export default PageList;
