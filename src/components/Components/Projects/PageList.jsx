import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProject } from "../../../w3s/w3sSlice";
import { FaPlus, FaTrash } from "react-icons/fa";

const PageList = ({
  projectId,
  selectedPageId,
  onSelectPage,
  onDeletePage,
}) => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.w3s.currentProject.data);
  const [newPageName, setNewPageName] = useState("");

  const toolbarSettings = useSelector(state => state.editor.toolbarSettings) || {};

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

  const handleCreatePage = () => {
    if (newPageName.trim() && currentProject) {
      const newPage = {
        name: newPageName.trim(),
        content: {
          components: [],
          layout: {},
        },
      };
      const updatedPages = [...currentProject.pages, newPage];
      dispatch(updateProject({ ...currentProject, pages: updatedPages }));
      setNewPageName("");
    }
  };

  const handleDeletePage = (pageIndex) => {
    if (window.confirm('Are you sure you want to delete this page?') && currentProject) {
      const updatedPages = currentProject.pages.filter((_, index) => index !== pageIndex);
      dispatch(updateProject({ ...currentProject, pages: updatedPages }));
    }
  };

  if (!currentProject) return <div>No project selected</div>;

  return (
    <div className="page-list text-gray-800">
      <h3 className="text-sm font-semibold mb-2 px-3 pt-2">Pages</h3>
      <div className="flex justify-center mt-2 px-3">
        <div className="flex w-full mb-2">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="New Page Name"
            className="w-full px-2 py-1 text-sm bg-white border border-[#c0c0c0] rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={handleCreatePage}
            className="px-2 py-1 bg-[#d0d0d0] text-gray-800 rounded-r hover:bg-[#c0c0c0] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      {currentProject.pages.length === 0 ? (
        <p className="text-sm text-gray-600 px-3">No pages found. Create a new one to get started!</p>
      ) : (
        <ul className="space-y-1 px-3 pb-2">
          {currentProject.pages.map((page, index) => (
            <li
              key={index}
              className={`page-list-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                page._id === selectedPageId
                  ? "selected"
                  : ""
              }`}
              onClick={() => onSelectPage(page)}
            >
              <span className="text-sm">{page.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(index);
                }}
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PageList;
