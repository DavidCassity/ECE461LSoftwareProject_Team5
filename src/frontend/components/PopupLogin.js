import React from "react";
import { Link } from "react-router-dom"; // Import the Link component from React Router
import "./PopupLogin.css";

const PopupLogin = ({ onClose }) => {
    return (
        <div className="popuplogin-overlay">
            <div className="popuplogin-box">
                <h2>Welcome!</h2>
                <p>Your account has been created successfully.</p>
                <Link to="/login">Go to Login Page</Link> {/* Use the Link component with the "to" prop */}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PopupLogin;
