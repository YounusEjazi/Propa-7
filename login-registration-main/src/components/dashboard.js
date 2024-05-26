// src/Dashboard.js
import React from 'react';
import './dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Hi User!</h2>
        <ul>
          <li><a href="#calendar">Calendar</a></li>
          <li><a href="#quiz">Quiz</a></li>
          <li><a href="#test">Test</a></li>
          <li><a href="#assignments">Assignments</a></li>
        </ul>
      </div>
      <div className="main-content">
        <section id="calendar">
          <h2>Calendar</h2>
          <p>Calendar content goes here...</p>
        </section>
        <section id="quiz">
          <h2>Quiz</h2>
          <p>Quiz content goes here...</p>
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
    </div>
  );
}

export default Dashboard;
