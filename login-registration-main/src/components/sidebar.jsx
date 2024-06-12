// src/components/Sidebar.js
import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faHouse, faUser, faPlus, faBook, faUsers } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';

function Sidebar({ user, isNavOpen, handleNavToggle }) {
  const defaultProfilePicture = '/user.png'; // Ensure this file is in the public folder

  return (
    <div className={`sidebar ${isNavOpen ? 'active' : ''}`}>
      <div id="close-btn" onClick={handleNavToggle}>
        <i className="fas fa-times"></i>
      </div>
      {user && (
        <div className="profile">
          <img
            src={user.profilePicture ? `http://localhost:3000${user.profilePicture}` : defaultProfilePicture}
            className="image"
            alt="Profile"
          />
          <h3 className="name">{user.fname} {user.lname}</h3>
          <p className="role">{user.userType}</p>
        </div>
      )}
      <nav className="sidebar-nav">
        <Link to="/dashboard" onClick={handleNavToggle}><FontAwesomeIcon icon={faHouse} /><span>Home</span></Link>
        <Link to="/exercises" onClick={handleNavToggle}><FontAwesomeIcon icon={faGraduationCap} /><span>Exercises</span></Link>
        <Link to="/userDetails" onClick={handleNavToggle}><FontAwesomeIcon icon={faUser} /><span>Profile</span></Link>
        {user && user.userType === 'Admin' && (
          <>
            <Link to="/addExercise" onClick={handleNavToggle}><FontAwesomeIcon icon={faPlus} /><span>Add Exercise</span></Link>
            <Link to="/materials" onClick={handleNavToggle}><FontAwesomeIcon icon={faBook} /><span>Materials</span></Link>
            <Link to="/admin/users" onClick={handleNavToggle}><FontAwesomeIcon icon={faUsers} /><span>Users</span></Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
