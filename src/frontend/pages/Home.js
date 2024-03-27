import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import computer from "../assets/computer.gif";
import circuitVideo from "../assets/videoBackground.mp4";

const Home = () => {
  return (
    <div>
      <div className="left">
        <div class="left-content">
          <h2>
            Build your project. <br /> Checkout!<sup>&reg;</sup> today.
          </h2>
          <h3>
            Checkout!<sup>&reg;</sup> is a premier hardware-checkout serivice.
          </h3>
          <Link to="/login">
            <button class="login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button class="login-btn">Sign-up</button>
          </Link>
        </div>
      </div>

      <div className="right">
        <div className="checklist left">
          <p class="item">
            <span style={{ color: "#7cca8c" }}>&#10003;</span> Create projects
          </p>
          <p class="item">
            <span style={{ color: "#7cca8c" }}>&#10003;</span> Work in teams
          </p>
          <p class="item">
            <span style={{ color: "#7cca8c" }}>&#10003;</span> Join and leave
            projects
          </p>
          <p class="item">
            <span style={{ color: "#7cca8c" }}>&#10003;</span> Securely
            sign-in/sign-out
          </p>
          <p class="item">
            <span style={{ color: "#7cca8c" }}>&#10003;</span> 24-hour customer
            service
          </p>
          <p class="item">
            <span style={{ color: "#7cca8c" }}>&#10003;</span> Free to use
          </p>
        </div>
        <div className="computer-img right">
          <img src={computer} alt="computer.gif" />
        </div>
      </div>
      <div className="circuit-video">
        <video src={circuitVideo} autoPlay loop muted />
      </div>
    </div>
  );
};

export default Home;
