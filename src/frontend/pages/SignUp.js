import React, { Component } from "react";
import PopupLogin from "../components/PopupLogin";
import "./SignUp.css"

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameID: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      validUsernameID: false,
      passwordMismatch: false,
      usernameExists: false,
    };

    this.handleUsernameIDChange = this.handleUsernameIDChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange =
    this.handleConfirmPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowPasswordChange = this.handleShowPasswordChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleUsernameIDChange = (event) => {
    this.setState({ usernameID: event.target.value });
    this.setState({ usernameExists: false })
    this.setState({ passwordMismatch: false })
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
    this.setState({ usernameExists: false })
    this.setState({ passwordMismatch: false })
  };

  handleConfirmPasswordChange = (event) => {
    this.setState({ confirmPassword: event.target.value });
    this.setState({ usernameExists: false })
    this.setState({ passwordMismatch: false })
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
      this.setState({ passwordMismatch: true });
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
      if (data.validUsernameID) {
        this.setState({ usernameExists: false });
        console.log("Username already exists");
      }
      else {
        this.setState({ usernameExists: true });
        console.log("Username already exists");
      }
      console.log(data.m);
        // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
        console.error('Error signing up:', error.response.data.message);
        // Handle error (e.g., show an error message to the user)
    }
  };

  // Function to handle closing the modal and resetting the state
  closeModal() {
    this.setState({
      usernameID: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      validUsernameID: false,
      passwordMismatch: false,
      usernameExists: false,
    });
  }


  render() {
    const { usernameID, password, confirmPassword, showPassword, validUsernameID, usernameExists, passwordMismatch } = this.state;

    if (validUsernameID) {
      return <PopupLogin onClose={this.closeModal} />;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="SignUpPage">
          <h1>Sign Up</h1>
          <div>
            <input id="textbox"
            placeholder="Username ID"
              type="text"
              value={usernameID}
              onChange={this.handleUsernameIDChange}
            />
          </div>
          <div>
            <input id="textbox"
            placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div>
            <input id="textbox"
              placeholder="Confirm Password"
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
            <label id="showpassword">Show Password</label>
          </div>
          <div>
          <input type="submit" value="Sign up" />
          </div>
          <div>
          {passwordMismatch ? (
    <p style={{ color: "red" }}>Passwords do not match</p>
    ) : (
    <p style={{ color: "transparent" }}>Passwords do not match</p>
    )}

    {usernameExists ? (
        <p style={{ color: "red" }}>Username already exists</p>
    ) : (
        <p style={{ color: "transparent" }}>Username already exists</p>
    )}
          </div>
        </div>
      </form>
    );
  }
}

export default SignUp;