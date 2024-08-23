import React, { useState } from "react";
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
            className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
          />
          <button
            onClick={handleCreatePage}
            className="px-2 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      {currentProject.pages.length === 0 ? (
        <p className="text-sm text-gray-400 px-3">No pages found. Create a new one to get started!</p>
      ) : (
        <ul className="space-y-1 px-3 pb-2">
          {currentProject.pages.map((page, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                page._id === selectedPageId
                  ? "bg-gray-600"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => onSelectPage(page)}
            >
              <span className="text-sm">{page.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(index);
                }}
                className="text-gray-400 hover:text-red-500"
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