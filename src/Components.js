import React from "react";

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

export const ProjectCard = ({ projectName, projectMembers, hardwareCheckedOut }) => {
return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', width: '300px' }}>
    <h3>{projectName}</h3>
    <p>Project Members: {projectMembers.join(', ')}</p>
    <p>Hardware Checked Out: {hardwareCheckedOut}</p>
    </div>
    );
};