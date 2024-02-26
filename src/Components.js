import React, { useState } from 'react';

export class textBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            label: props.label,
            type: props.type
        };
    }

    render(){
        const {label, type} = this.state;

        return(
            <div>
                    <div>
                        <label>{label}: </label>
                    </div>
            </div>
        );

    }
}

export const ProjectCard = ({ projectName, projectDescription, projectMembers, hardwareCheckedOut, projectOwner, projectId, onRequestHardware }) => {
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

  export const RequestHardwareButton = ({ projectId, onRequestHardware }) => {
    const [loading, setLoading] = useState(false);

    const handleRequestHardware = async () => {
        try {
        setLoading(true);
        // Make a request to the backend API to check for available hardware
        // Replace the following line with your actual API call
        const response = await fetch(`/api/hardware/request/${projectId}`, {
            method: 'POST',
            // Add headers or other configurations as needed
        });
        
        const data = await response.json();
        
        // Handle the response from the backend
        onRequestHardware(data.success); // You can pass a boolean indicating success or failure
        } catch (error) {
        console.error('Error requesting hardware:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <button onClick={handleRequestHardware} disabled={loading}>
        {loading ? 'Requesting Hardware...' : 'Request Hardware'}
        </button>
    );
};