import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import Dashboard from "./components/dashboard";
import NotFound from "./components/notfound";
import NavBar from "./components/navbar";
import Sidebar from "./components/sidebar";
import ExerciseDetails from "./components/exDetails";
import AddExercise from "./components/AddExercise"; // Import the new component
import Exercises from "./components/Exercises";

// New components
import UserHome from "./components/userHome";
// import Courses from './components/Courses';
import Materials from "./components/Materials";

function ProtectedRoute({ element: Component, ...rest }) {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/sign-in" />;
}

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(window.localStorage.getItem("user"));

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn && (
          <NavBar handleNavToggle={handleNavToggle} isNavOpen={isNavOpen} />
        )}
        {isLoggedIn && (
          <Sidebar
            user={user}
            isNavOpen={isNavOpen}
            handleNavToggle={handleNavToggle}
          />
        )}
        <Routes>
          {/* Existing routes */}
          <Route path="/" element={isLoggedIn ? <UserDetails /> : <Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/userDetails"
            element={<ProtectedRoute element={UserDetails} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path="/exDetails/:id"
            element={<ProtectedRoute element={ExerciseDetails} />}
          />
          <Route
            path="/addExercise"
            element={<ProtectedRoute element={AddExercise} />}
          />
          <Route
            path="/exercises"
            element={<ProtectedRoute element={Exercises} />}
          />
          <Route path="*" element={<NotFound />} />

          {/* New routes */}
          <Route path="/home" element={<UserHome />} />
          {/* <Route path="/courses" element={<Courses />} /> */}
          <Route path="/materials" element={<Materials />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
