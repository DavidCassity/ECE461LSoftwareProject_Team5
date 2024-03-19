import React, { useState } from 'react';
import { Button } from '@mui/material';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  const handleAddProject = () => {
    setProjects([...projects, projects.length + 1]);
  };

  const handleJoinProject = () => {
    //console.log(`Joining Project ${projectNumber}`); make this call projectjoinpopup
  };

  return (
    <div>
      {projects.map((projectNumber) => (
        <ProjectCard key={projectNumber} projectName={`Project ${projectNumber}`} />
      ))}
      <Button variant="contained" onClick={handleAddProject} style={{ position: 'center', marginTop: '20px' }}>
        Add Project
      </Button>
      <Button variant="contained" onClick={handleJoinProject} style={{ position: 'center', marginTop: '20px'}}>
        Join Project
      </Button>
    </div>
  );
};

export default Projects;