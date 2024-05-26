// src/App.js
import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import Dashboard from "./components/dashboard"; // Ensure this path is correct
import NotFound from "./components/notfound";

// Navigation Bar Component
function NavBar() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    window.localStorage.removeItem("loggedIn");
    window.localStorage.removeItem("token");
    window.location.href = "/sign-in";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Get started!</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/userDetails">User Details</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/sign-in">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sign-up">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

// Protected Route Component
function ProtectedRoute({ element: Component, ...rest }) {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/sign-in" />;
}

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element={isLoggedIn === "true" ? <UserDetails /> : <Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<ProtectedRoute element={UserDetails} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
