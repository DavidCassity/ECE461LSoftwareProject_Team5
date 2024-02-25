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