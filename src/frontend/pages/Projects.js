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
  const [userID, setUserID] = useState('');
  const [availability, setAvailability] = useState([]);
  const [capacity, setCapacity] = useState([]);
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
      setAvailability(data.availability);
      setCapacity(data.capacity);
      console.log(data.authenticated);
      if (!data.authenticated) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // useEffect(() => {
  //   fetchProjects();
  // }, []);

  useEffect(() => {
    const fetchAndSetProjects = async () => {
      await fetchProjects(); // Call fetchProjects when the component renders
      const interval = setInterval(() => {
        fetchProjects();
      }, 5000); // Fetch projects every 5 seconds
      return () => clearInterval(interval); // Clean up the interval when the component unmounts
    };
  
    fetchAndSetProjects();
  }, []);
  

  const updateProjects = () => {
    fetchProjects();
  };

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

  const updateAvailability = (index, newAvailability, projectID, userID, newCheckOut) => {
    console.log("Updating availability and checkout for projectID: ", projectID, " and userID: ", userID, " with new availability: ", newAvailability, " and new checkout: ", newCheckOut, " at index: ", index, " in the projects array.");

    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => {
      if (project.projectID === projectID) {
        const updatedCheckout = { ...project.checkOut };
        const userCheckoutArray = [...updatedCheckout[userID]];
        userCheckoutArray[index] = newCheckOut;
        updatedCheckout[userID] = userCheckoutArray;
        return {
        ...project,
        checkOut: updatedCheckout
        };
      }
      return project;
      });
      return updatedProjects;
    });

    setAvailability(prevAvailability => {
      const updatedAvailability = [...prevAvailability];
      updatedAvailability[index] = newAvailability;
      return updatedAvailability;
    });

    
  };

  return (
    <div>
      <Grid container spacing={2} style={{marginTop: '10px', marginBottom: '10px'}}>
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
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={6} key={project.projectID}>
            <ProjectCard
              projectID={project.projectID}
              ownerID={project.ownerID}
              members={project.members}
              description={project.description}
              checkOut={project.checkOut}
              availability={availability}
              capacity={capacity}
              userID={userID}
              updateAvailability={updateAvailability}
              updateProjects={updateProjects}
            />
          </Grid>
        ))}
      </Grid>
      {showCreationPopup && <ProjectCreationPopup usernameID={userID} onClose={handleSuccess} />}
      {showJoinPopup && <ProjectJoinPopup onClose={handleSuccess} />}
    </div> 
  );
};

export default Projects;