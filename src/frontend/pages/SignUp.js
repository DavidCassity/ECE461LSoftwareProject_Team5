import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopupLogin from "../components/PopupLogin";
import "./SignUp.css"


const SignUp = () => {
  const [usernameID, setUsernameID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validUsernameID, setValidUsernameID] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const navigate = useNavigate();

  const handleUsernameIDChange = (event) => {
    setUsernameID(event.target.value);
    setUsernameExists(false);
    setPasswordMismatch(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setUsernameExists(false);
    setPasswordMismatch(false);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setUsernameExists(false);
    setPasswordMismatch(false);
  };

  const handleShowPasswordChange = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      console.log("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameID, password }),
      });

      const data = await response.json();
      setValidUsernameID(data.validUsernameID);
      if (data.validUsernameID) {
        setUsernameExists(false);
        console.log("Username already exists");
      } else {
        setUsernameExists(true);
        console.log("Username already exists");
      }
      console.log(data.m);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error signing up:", error.response.data.message);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const closeModal = () => {
    setUsernameID("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setValidUsernameID(false);
    setPasswordMismatch(false);
    setUsernameExists(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await fetch("/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.authenticated) {
        navigate("/logout");
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  if (validUsernameID) {
    return <PopupLogin onClose={closeModal} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="SignUpPage">
        <h1>Sign Up</h1>
        <div>
          <input
            id="textbox"
            placeholder="Username ID"
            type="text"
            value={usernameID}
            onChange={handleUsernameIDChange}
          />
        </div>
        <div>
          <input
            id="textbox"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <input
            id="textbox"
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <div>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleShowPasswordChange}
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
};

export default SignUp;;