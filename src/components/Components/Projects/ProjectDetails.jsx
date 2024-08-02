import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProject } from '../../w3s';
import ProjectForm from './ProjectForm';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProject, status, error } = useSelector((state) => state.w3s.projects);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchProject(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div>Loading project details...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!currentProject) return <div>Project not found</div>;

  return (
    <div className="project-details">
      <h2 className="text-2xl font-bold mb-4">{currentProject.name}</h2>
      <p className="text-gray-600 mb-4">Last modified: {new Date(currentProject.lastModified).toLocaleString()}</p>
      
      {isEditing ? (
        <ProjectForm
          project={currentProject}
          onSubmit={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Project
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
          >
            Back to Projects
          </button>
        </div>
      )}
      
      {/* Add more project details here */}
    </div>
  );
};

export default ProjectDetails;