import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Exercises.css';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:3000/get-exercises', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setExercises(data.data);
        } else {
          console.error('Failed to fetch exercises');
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const deleteExercise = (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      fetch(`http://localhost:3000/delete-exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ id }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            setExercises(exercises.filter(exercise => exercise.id !== id));
            alert('Exercise deleted successfully');
          } else {
            alert('Failed to delete exercise');
          }
        })
        .catch(error => console.error('Error:', error));
    }
  };

  return (
    <section className="courses">
      <h1 className="heading">Our Exercises</h1>
      <div className="box-container">
        {exercises.map(exercise => (
          <div className="box" key={exercise.id}>
            <div className="tutor">
              <img src="images/pic-2.jpg" alt="" />
              <div className="info">
                <h3>{exercise.title}</h3>
                <span>{exercise.date}</span>
              </div>
            </div>
            <div className="thumb">
              <img src={exercise.img} alt={exercise.title} />
              <span>{exercise.description}</span>
            </div>
            <h3 className="title">{exercise.title}</h3>
            <Link to={`/exDetails/${exercise.id}`} className="inline-btn">View Exercise</Link>
            {user && user.userType === 'Admin' && (
              <button className="delete-btn" onClick={() => deleteExercise(exercise.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Exercises;
