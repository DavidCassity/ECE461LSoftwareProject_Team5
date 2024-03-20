import React, { useState } from 'react';
import { Button } from '@mui/material';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  const handleAddProject = () => {
    setProjects([...projects, projects.length + 1]);
  };

  return (
    <div>
      {projects.map((projectNumber) => (
        <ProjectCard key={projectNumber} projectName={`Project ${projectNumber}`} />
      ))}
      <Button variant="contained" onClick={handleAddProject} style={{ marginTop: '20px' }}>
        Add Project
      </Button>
    </div>
  );
};

export default Projects;