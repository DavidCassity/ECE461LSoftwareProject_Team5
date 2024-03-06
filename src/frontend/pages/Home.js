import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Welcome! The next generation of hardware is here!</h2>
        <Link to="/login">
          <button class="login-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button class="login-btn">Sign-up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
