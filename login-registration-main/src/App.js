import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from './components/login_component';
import SignUp from './components/signup_component';
import UserDetails from './components/userDetails';
import Dashboard from './components/dashboard';
import NotFound from './components/notfound';
import NavBar from './components/navbar';
import Sidebar from './components/sidebar';
import ExerciseDetails from './components/exDetails';
import AddExercise from './components/AddExercise';
import Exercises from './components/Exercises';
import Materials from './components/Materials';
import AdminHome from './components/adminHome';

function ProtectedRoute({ element: Component, ...rest }) {
  const isLoggedIn = window.localStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/sign-in" />;
}

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/userData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'ok') {
            setUser(data.data);
            window.localStorage.setItem('user', JSON.stringify(data.data));
          } else {
            window.localStorage.clear();
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          window.localStorage.clear();
        });
    }
  }, []);

  const isLoggedIn = window.localStorage.getItem('loggedIn') === 'true';

  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn && <NavBar handleNavToggle={handleNavToggle} isNavOpen={isNavOpen} />}
        {isLoggedIn && <Sidebar user={user} isNavOpen={isNavOpen} handleNavToggle={handleNavToggle} />}
        <Routes>
          <Route path="/" element={isLoggedIn ? <UserDetails /> : <Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<ProtectedRoute element={UserDetails} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/exDetails/:id" element={<ProtectedRoute element={ExerciseDetails} />} />
          <Route path="/addExercise" element={<ProtectedRoute element={AddExercise} />} />
          <Route path="/exercises" element={<ProtectedRoute element={Exercises} />} />
          <Route path="/materials" element={<ProtectedRoute element={Materials} />} />
          <Route path="/admin/users" element={<ProtectedRoute element={AdminHome} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
