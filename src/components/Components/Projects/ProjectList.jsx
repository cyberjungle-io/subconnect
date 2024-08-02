import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../../w3s/w3sSlice';
import ProjectItem from './ProjectItem';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { list: projects, status, error } = useSelector((state) => {
    console.log('Current state:', state); // Debug log
    return state.w3s.projects;
  });

  useEffect(() => {
    console.log('ProjectList useEffect, status:', status); // Debug log
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  console.log('ProjectList render, projects:', projects, 'status:', status); // Debug log

  if (status === 'loading') {
    return <div>Loading projects...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!projects) {
    return <div>No projects data available. Please try again later.</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Your Projects</h3>
      {projects.length === 0 ? (
        <p>No projects found. Create a new one to get started!</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;