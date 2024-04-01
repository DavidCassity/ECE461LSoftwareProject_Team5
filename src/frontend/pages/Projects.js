import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, Button } from '@mui/material';
import ProjectCard from '../components/ProjectCard';
import ProjectCreationPopup from '../components/ProjectCreationPopup';
import ProjectJoinPopup from '../components/ProjectJoinPopup';
import '../components/Banner.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showCreationPopup, setShowCreationPopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userID, setUserID] = useState(''); // Add this line
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
        setUserID(data.userID);
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
      <div className="global-capacity-banner">
        <h2 className="banner-title">Global Capacity</h2>
        <div className="meter-container">
          <div className="meter" style={{ width: `${(0 / 1) * 100}%`, backgroundColor: 'green' }}>
            <p className="checked-out-text">{0}/{1}</p>
          </div>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" onClick={handleAddProject} className="add-project-button">
            Add Project
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" onClick={handleJoinProject} className="join-project-button">
            Join Project
          </Button>
        </Grid>
      </Grid>
      {showCreationPopup && <ProjectCreationPopup usernameID={userID} onClose={() => setShowCreationPopup(false)} />}
      {showJoinPopup && <ProjectJoinPopup onClose={() => setShowJoinPopup(false)} />}
    </div> 
  );
};

export default Projects;