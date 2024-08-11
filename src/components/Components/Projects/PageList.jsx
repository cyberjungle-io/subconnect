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
    <div className="page-list">
      <h3 className="text-lg font-semibold mb-2">Pages</h3>
      <div className=" mb-4">
        <input
          type="text"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          placeholder="New page name"
          className="flex-grow mr-2 px-2 py-1 border rounded"
        />
        <button
          onClick={handleCreatePage}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          <FaPlus />
        </button>
      </div>
      {currentProject.pages.length === 0 ? (
        <p>No pages found. Create a new one to get started!</p>
      ) : (
        <ul className="space-y-2">
          {currentProject.pages.map((page, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-3 rounded shadow cursor-pointer transition-colors duration-200 ${
                page._id === selectedPageId
                  ? "bg-blue-100"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => onSelectPage(page)}
            >
              <span>{page.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(index);
                }}
                className="text-red-500 hover:text-red-700"
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
