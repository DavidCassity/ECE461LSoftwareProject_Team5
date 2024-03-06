// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./frontend/components/Navbar";

import Home from "./frontend/pages/Home";
import About from "./frontend/pages/About";
import Contact from "./frontend/pages/Contact";
import Projects from "./frontend/pages/Projects";
import Login from "./frontend/pages/Login";
import SignUp from "./frontend/pages/SignUp";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
