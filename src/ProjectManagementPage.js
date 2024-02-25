// ProjectManagementPage.js

import React from 'react';
import { ProjectCard } from './Components';

const ProjectManagementPage = () => {
  // Placeholder data (replace with data fetched from the database)
  const projects = [
    { name: 'Project A', members: ['John', 'Jane'], hardwareCheckedOut: 5 },
    { name: 'Project B', members: ['Alice', 'Bob'], hardwareCheckedOut: 8 },
    // Add more projects as needed
  ];

  const globalHardwareCapacity = 20; // Placeholder for global hardware capacity

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Project Management Page</h2>
      <p>Global Hardware Capacity: {globalHardwareCapacity}</p>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            projectName={project.name}
            projectMembers={project.members}
            hardwareCheckedOut={project.hardwareCheckedOut}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectManagementPage;
