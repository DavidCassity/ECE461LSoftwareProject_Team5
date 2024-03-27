import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import ProjectCard from '../components/ProjectCard';
import ProjectCreationPopup from '../components/ProjectCreationPopup';
import ProjectJoinPopup from '../components/ProjectJoinPopup';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showCreationPopup, setShowCreationPopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  
  // Call this function when first visiting the page
  useEffect(() => {
    const handleChecking = async() => {
      try {
        const response = await fetch('/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Set Content-Type to JSON
          },
        });
        const data = await response.json();
        console.log("API response: ", data);
        setAuthenticated(data.authenticated);
        console.log(data.authenticated);
        if(!data.authenticated) {
          navigate('/login');
        }
      }
      catch (error) {
        console.error('Error:', error);
      }
    };
    handleChecking();
  }, []); // Pass an empty array to only run once

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