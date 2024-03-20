import React, { Component } from "react";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameID: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      validUsernameID: false,
    };

    this.handleUsernameIDChange = this.handleUsernameIDChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange =
    this.handleConfirmPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowPasswordChange = this.handleShowPasswordChange.bind(this);
  }

  handleUsernameIDChange = (event) => {
    this.setState({ usernameID: event.target.value });
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

    const { usernameID, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return;
    }

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
        body: JSON.stringify({ usernameID, password }),
      });

      const data = await response.json();
      this.setState({ validUsernameID: data.validUsernameID });

      console.log(data.m);
        // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
        console.error('Error signing up:', error.response.data.message);
        // Handle error (e.g., show an error message to the user)
    }
  };

  render() {
    const { usernameID, password, confirmPassword, showPassword, validUsernameID } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="SignUpPage">
          <h1>Sign Up Page</h1>
          <div>
            <label>UsernameID: </label>
            <input
              type="text"
              value={usernameID}
              onChange={this.handleUsernameIDChange}
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
          <input type="submit" value="Sign up" />
          {validUsernameID? <p>Sign Up Successful</p> : <p></p>}
        </div>
      </form>
    );
  }
}

export default SignUp;