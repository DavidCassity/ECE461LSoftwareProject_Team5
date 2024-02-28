import RequestHardwareButton from "./RequestHardwareButton";

const ProjectCard = ({ projectName, projectDescription, projectMembers, hardwareCheckedOut, projectOwner, projectId, onRequestHardware }) => {
    return (
      <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', width: '300px' }}>
        <h3>{projectName}</h3>
        <p>{projectDescription}</p>
        <p>Project Owner: {projectOwner}</p>
        <p>Project Members: {projectMembers.join(', ')}</p>
        <p>Hardware Checked Out: {hardwareCheckedOut}</p>
        <RequestHardwareButton projectId={projectId} onRequestHardware={onRequestHardware} />
      </div>
    );
  };

  export default ProjectCard