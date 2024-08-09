import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPages, createPage, deletePage } from '../../w3s/w3sSlice';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const PageList = ({ projectId }) => {
  const dispatch = useDispatch();
  const { pages } = useSelector((state) => state.w3s.currentProject.data || { pages: [] });
  const { status, error } = useSelector((state) => state.w3s.currentProject);
  const [newPageName, setNewPageName] = useState('');

  useEffect(() => {
    dispatch(fetchPages(projectId));
  }, [dispatch, projectId]);

  const handleCreatePage = () => {
    if (newPageName.trim()) {
      dispatch(createPage({ projectId, pageData: { name: newPageName.trim() } }));
      setNewPageName('');
    }
  };

  const handleDeletePage = (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      dispatch(deletePage({ projectId, pageId }));
    }
  };

  if (status === 'loading') return <div>Loading pages...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="page-list">
      <h3 className="text-lg font-semibold mb-2">Pages</h3>
      <div className="flex mb-4">
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
      {pages.length === 0 ? (
        <p>No pages found. Create a new one to get started!</p>
      ) : (
        <ul className="space-y-2">
          {pages.map((page) => (
            <li key={page._id} className="flex items-center justify-between bg-white p-3 rounded shadow">
              <span>{page.name}</span>
              <div>
                <button
                  onClick={() => {/* TODO: Implement edit functionality */}}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeletePage(page._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PageList;