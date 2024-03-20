import React, { useState } from 'react';
import { Button } from '@mui/material';
import ProjectCard from '../components/ProjectCard';
import ProjectCreationPopup from '../components/ProjectCreationPopup';
import ProjectJoinPopup from '../components/ProjectJoinPopup';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showCreationPopup, setShowCreationPopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  const handleAddProject = () => {
    setShowCreationPopup(true);
  };

  const handleJoinProject = () => {
    setShowJoinPopup(true);
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

      {showCreationPopup && <ProjectCreationPopup onClose={() => setShowCreationPopup(false)} />}
      {showJoinPopup && <ProjectJoinPopup onClose={() => setShowJoinPopup(false)} />}
    </div>
  );
};

export default Projects;