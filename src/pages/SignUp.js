import React, { Component } from "react";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameID: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
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

  handleSubmit = (event) => {
    const { usernameID, password, confirmPassword } = this.state;
    let message = password == confirmPassword;
    message
      ? console.log("Passwords match")
      : console.log("Passwords do not match");
    event.preventDefault();
  };

  handleShowPasswordChange = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { usernameID, password, confirmPassword, showPassword } = this.state;
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
        </div>
      </form>
    );
  }
}

export default SignUp;
