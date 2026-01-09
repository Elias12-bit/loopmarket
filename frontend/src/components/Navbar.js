import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo-title">
        <img src={logo} alt="Logo" />
        <h1>PC Masters</h1>
      </div>
      <nav>
        <Link to="/">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/sales">Sales</Link>
        <Link to="/team">Team</Link>
        <Link to="/registration">Registration</Link>

      </nav>
    </header>
  );
};

export default Navbar;