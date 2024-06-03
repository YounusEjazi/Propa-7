// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import './navbar.css';

function NavBar({ handleNavToggle, isNavOpen }) {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    window.localStorage.removeItem("loggedIn");
    window.localStorage.removeItem("token");
    window.location.href = "/sign-in";
  };

  return (
    <div className='navbar'>
      <div className='navbar-toggle' onClick={handleNavToggle}>
        {isNavOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div className='navbar-links'>
        <ul>
          {isLoggedIn ? (
            <>
              <li><button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/sign-in">Login</Link></li>
              <li><Link to="/sign-up">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
