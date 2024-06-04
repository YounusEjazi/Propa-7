import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import './exDetails.css';

const ItemType = {
  IMAGE: 'image',
};

const DraggableImage = ({ id, src }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.IMAGE,
    item: { id, src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="image-wrapper" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={src} alt="" className="draggable-image" />
    </div>
  );
};

const DroppableBox = ({ id, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType.IMAGE,
    drop: (item) => onDrop(item, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="droppable-box" style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
      {children}
    </div>
  );
};

const ExerciseDetails = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState();
  const [boxes, setBoxes] = useState({
    box1: [],
    box2: [],
    box3: [],
    box4: [
      { id: 1, src: '/Tragwerkelemente/04.png' },
      { id: 2, src: '/Tragwerkelemente/02.png' },
      { id: 3, src: '/Tragwerkelemente/03.png' },
    ],
  });

  useEffect(() => {
    fetch(`http://localhost:3000/get-exercise/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setExercise(data.data);
        } else {
          console.error('Failed to fetch exercise details');
        }
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  const handleDrop = (item, boxId) => {
    setBoxes((prevState) => {
      const newBoxes = { ...prevState };
      Object.keys(newBoxes).forEach((key) => {
        newBoxes[key] = newBoxes[key].filter((img) => img.id !== item.id);
      });
      newBoxes[boxId].push(item);
      return newBoxes;
    });
  };

  if (!exercise) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="playlist-details">
        <h1 className="heading">Exercise Information</h1>
        <div className="row">
          <div className="column">
            <div className="thumb">
              <img src={exercise.img} alt={exercise.title} />
              <span>{exercise.description}</span>
            </div>
          </div>
          <div className="column">
            <div className="tutor">
              <img src="" alt="Tutor" />
              <div>
                <h3>Tutor</h3>
                <span>{new Date(exercise.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="details">
              <h3>{exercise.title}</h3>
              <p>{exercise.description}</p>
              <a href="/teacher_profile" className="inline-btn">View Profile</a>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h1 className="heading">Exercise Elements</h1>
        <div className="box-container">
          <div className="box-header">
            <h2>Tragwerkelemente</h2>
            <DroppableBox key="box1" id="box1" onDrop={handleDrop}>
              {boxes.box1.map((img) => (
                <DraggableImage key={img.id} id={img.id} src={img.src} />
              ))}
            </DroppableBox>
          </div>
          <div className="box-header">
            <h2>Fügungen</h2>
            <DroppableBox key="box2" id="box2" onDrop={handleDrop}>
              {boxes.box2.map((img) => (
                <DraggableImage key={img.id} id={img.id} src={img.src} />
              ))}
            </DroppableBox>
          </div>
          <div className="box-header">
            <h2>Box 3</h2>
            <DroppableBox key="box3" id="box3" onDrop={handleDrop}>
              {boxes.box3.map((img) => (
                <DraggableImage key={img.id} id={img.id} src={img.src} />
              ))}
            </DroppableBox>
          </div>
          <div className="box-header">
            <h2>Box 4</h2>
            <DroppableBox key="box4" id="box4" onDrop={handleDrop}>
              {boxes.box4.map((img) => (
                <DraggableImage key={img.id} id={img.id} src={img.src} />
              ))}
            </DroppableBox>
          </div>
        </div>
      </section>
    </DndProvider>
  );
};

export default ExerciseDetails;
