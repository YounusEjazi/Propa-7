import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import styles from './dashboard.css';
import { App } from './quiz';
import Login from './login_component';
import Exercises from './Exercises';

function Dashboard() {
  const [user, setUser] = useState(null);

  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
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
                <p className="likes">Total: <span>25</span></p>
                <Link to={`/Exercises`} className="inline-btn">View Exercise</Link>
                <p className="likes">Total Mistakes: <span>12</span></p>
                <a href="#" className="inline-btn">View Mistakes</a>
                <p className="likes">Total Comments: <span>4</span></p>
                {/* <a href="#" className="inline-btn">View Comments</a> */}
                <Link to={`/feedback`} className="inline-btn">View Feedback</Link>
              </div>
            </div>
          </section>
          <section id="quiz">
            <h2>Quiz</h2>
            <App />
          </section>
          <section id="test">
            <h2>Test</h2>
            <p>Test content goes here...</p>
          </section>
          <section id="assignments">
            <h2>Assignments</h2>
            <p>Assignments content goes here...</p>
          </section>
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default Dashboard;

ReactDOM.render(<Dashboard />, document.getElementById("root"));
