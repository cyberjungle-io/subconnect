import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../w3s';
import ProjectItem from './ProjectItem';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { list: projects, status, error } = useSelector((state) => state.w3s.projects);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Loading projects...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="project-list">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found. Create a new one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectItem key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;