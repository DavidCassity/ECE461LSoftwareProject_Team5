import React from 'react';
import { ProjectCard } from './Components';

const ProjectManagementPage = () => {
  // Placeholder data (replace with data fetched from the database)
  const projects = [
    { id: 1, name: 'Project A', description: 'This is project A', owner: 'John Doe', members: ['John', 'Jane'], hardwareCheckedOut: 5 },
    { id: 2, name: 'Project B', description: 'Project B details', owner: 'Alice Smith', members: ['Alice', 'Bob'], hardwareCheckedOut: 8 },
    // Add more projects as needed
  ];

  const globalHardwareCapacity = 20; // Placeholder for global hardware capacity

  const handleRequestHardware = (projectId, success) => {
    if (success) {
      // Handle success, e.g., update the UI or show a success message
      console.log(`Hardware requested for project ${projectId}`);
    } else {
      // Handle failure, e.g., show an error message
      console.error(`Failed to request hardware for project ${projectId}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Project Management Page</h2>
      <p>Global Hardware Capacity: {globalHardwareCapacity}</p>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            projectName={project.name}
            projectDescription={project.description}
            projectOwner={project.owner}
            projectMembers={project.members}
            hardwareCheckedOut={project.hardwareCheckedOut}
            projectId={project.id}
            onRequestHardware={(success) => handleRequestHardware(project.id, success)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectManagementPage;