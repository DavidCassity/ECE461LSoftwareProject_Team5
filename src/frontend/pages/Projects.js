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
  const [userID, setUserID] = useState(''); // Add this line
  const navigate = useNavigate();


  // Function to fetch projects from the server
  const fetchProjects = async () => {
    try {
      const response = await fetch('/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("API response: ", data);
      setAuthenticated(data.authenticated);
      setUserID(data.userID);
      setProjects(data.projects);
      console.log(data.authenticated);
      if (!data.authenticated) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Call this function when first visiting the page
  useEffect(() => {
    fetchProjects();
  }, []); // Pass an empty array to only run once

  const handleAddProject = () => {
    setShowCreationPopup(true);
  };

  const handleJoinProject = () => {
    setShowJoinPopup(true);
  };

  const handleSuccess = async () => {
    await fetchProjects();
    setShowCreationPopup(false);
    setShowJoinPopup(false);
  }

  return (
    <div>
      {/* Iterate over each project in the projects array */}
      {projects.map(project => (
        <ProjectCard key={project.projectID} 
            projectID={project.projectID} 
            ownerID={project.ownerID} 
            members={project.members}
            checkOut={project.checkOut}
            availability={project.availability}
            capacity={project.capacity}
            userID={userID}
            />
      ))}
      <Button variant="contained" onClick={handleAddProject} style={{ position: 'center', marginTop: '20px' }}>
        Add Project
      </Button>
      <Button variant="contained" onClick={handleJoinProject} style={{ position: 'center', marginTop: '20px'}}>
        Join Project
      </Button>

      {showCreationPopup && <ProjectCreationPopup usernameID={userID} onClose={handleSuccess} />}
      {showJoinPopup && <ProjectJoinPopup onClose={handleSuccess} />}
    </div> 
  );
};

export default Projects;
