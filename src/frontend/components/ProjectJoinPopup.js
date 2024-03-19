import React, { Component } from "react";
import axios from 'axios'

class ProjectJoinPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectID: "",
      password: "",
      showPassword: false,
    };

    this.handleProjectIDChange = this.handleProjectIDChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowPasswordChange = this.handleShowPasswordChange.bind(this);
  }

  handleProjectIDChange = (event) => {
    this.setState({ projectID: event.target.value });
  };


  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleShowPasswordChange = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { projectID, password } = this.state;

    try {
        const response = await axios.post('http://127.0.0.1:81/projects', {
            projectID,
            password,
        });

        console.log(response.data.message);
        // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
        console.error('Error signing up:', error.response.data.message);
        // Handle error (e.g., show an error message to the user)
    }
  };

  render() {
    const { projectID, password, showPassword } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="SignUpPage">
          <h2>Join Project</h2>
          <div>
            <label>ProjectID: </label>
            <input
              type="text"
              value={projectID}
              onChange={this.handleProjectIDChange}
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={this.handleShowPasswordChange}
            />
            <label>Show Password</label>
          </div>
          <input type="submit" value="Join Project" />
        </div>
      </form>
    );
  }
}

export default ProjectJoinPopup;