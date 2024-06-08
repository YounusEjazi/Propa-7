import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './quiz.css';

export function App() {
  const [exercises, setExercises] = useState([]);

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

  return (
    <div className="wrapper">
      {exercises.map(exercise => (
        <Card
          key={exercise._id} // Use MongoDB Object ID as key
          id={exercise.id}  // Use the custom ID for navigation
          img={exercise.img}
          title={exercise.title}
          description={exercise.description}
        />
      ))}
    </div>
  );
}

function Card(props) {
  return (
    <div className="card">
      <div className="card__body">
        <img src={props.img} className="card__image" alt={props.title} />
        <h2 className="card__title">{props.title}</h2>
        <p className="card__description">{props.description}</p>
      </div>
      <Link to={`/exDetails/${props.id}`} className="card__btn">View Exercise</Link>
    </div>
  );
}
