// src/components/dashboard.js

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import styles from './dashboard.css';
import { App } from './quiz';
import Login from './login_component';
import CircularDeterminate from './CircularDeterminate';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/get-exercises', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setExercises(data.data);
        } else {
          console.error('Failed to fetch exercises');
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className={styles.dashboard}>
      {user ? (
        <div className={styles.mainContent}>
          <section id="calendar">
            <h2>Progress</h2>
            <div className="boxContainer">
              <div className="box1">
                <h3 className="title">Completed Exercises</h3>

                
                <p className="likes"><span> </span></p>
                <a href="#" className="inline-btn">View Progress</a>
                <p className="likes">Total Mistakes: <span> </span></p>
                {/* <a href="#" className="inline-btn">View Comments</a> */}

                <Link to={`/feedback`} className="inline-btn">View Feedback</Link>
                <p className="likes">Total Comments: <span>2</span></p>
                <Link to={`/Exercises`} className="inline-btn">View Exercise</Link>
              </div>
            </div>
          </section>
          <section id="quiz">
            <h2>Practice Your Lessons Now</h2>
            <App />
          </section>
          <section id="progress" className={styles.progressSection}>
            <h2>Current Progress</h2>
            <div className={styles.progressWrapper}>
              <CircularDeterminate exercises={exercises} />
            </div>
          </section>
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default Dashboard;
