import React, { Component } from "react";
import axios from 'axios'

class ProjectCreationPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ownerID: "", //make this the userID of the person logged in
        projectID: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
    };

    this.handleOwnerID = this.handleOwnerID.bind(this);
    this.handleProjectID = this.handleProjectID.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowPasswordChange = this.handleShowPasswordChange.bind(this);
  }

  handleOwnerID = (event) => {
    this.setState({ ownerID: event.target.value });
  };

  handleProjectID = (event) => {
    this.setState({ projectID: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = (event) => {
    this.setState({ confirmPassword: event.target.value });
  };

  handleShowPasswordChange = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { ownerID, projectID, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return;
    }

    try {
        const response = await axios.post('http://127.0.0.1:81/projects', {
            ownerID,
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
    const { ownerID, projectID, password, confirmPassword, showPassword } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="SignUpPage">
          <h2>Project Creation</h2>
          <div>
            <label>OwnerID: </label>
            <input
              type="text"
              value={ownerID}
              onChange={this.handleOwnerID}
            />
          </div>
          <div>
            <label>ProjectID: </label>
            <input
              type="text"
              value={projectID}
              onChange={this.handleProjectID}
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
            <label>Confirm Password: </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={this.handleConfirmPasswordChange}
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
          <input type="submit" value="Create Project" />
        </div>
      </form>
    );
  }
}//after submitting make the popup disappear

export default ProjectCreationPopup;
