import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  const [boxes, setBoxes] = React.useState({
    box1: [
      { id: 1, src: '/Tragwerkelemente/04.png' },
      { id: 2, src: '/Tragwerkelemente/02.png' },
    ],
    box2: [
      { id: 3, src: '/Tragwerkelemente/03.png' },
    ],
    box3: [
      { id: 4, src: '/Tragwerkelemente/02.png' },
    ],
  });

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

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="playlist-details">
        <h1 className="heading">Excercize Details</h1>
        <div className="row">
          <div className="column">
            <div className="thumb">
              <img src="https://www.bausource.com/wp-content/uploads/2017/09/%C2%A9Jeroen-Musch_153.jpg" alt="" />
              <span>Villa</span>
            </div>
          </div>
          <div className="column">
            <div className="tutor">
              <img src="https://www.bausource.com/wp-content/uploads/2017/09/%C2%A9Jeroen-Musch_153.jpg" alt="" />
              <div>
                <h3>Tutor</h3>
                <span>21-10-2022</span>
              </div>
            </div>
            <div className="details">
              <h3>Complete exercise x</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum minus reiciendis, error sunt veritatis exercitationem deserunt velit doloribus itaque voluptate.</p>
              <a href="/teacher_profile" className="inline-btn">View Profile</a>
            </div>
          </div>
        </div>
      </section>
      <section className="playlist-videos">
        <h1 className="heading">Ex Elements</h1>
        <div className="box-container">
          <DroppableBox id="box1" onDrop={handleDrop}>
            {boxes.box1.map((img) => (
              <DraggableImage key={img.id} id={img.id} src={img.src} />
            ))}
          </DroppableBox>
          <DroppableBox id="box2" onDrop={handleDrop}>
            {boxes.box2.map((img) => (
              <DraggableImage key={img.id} id={img.id} src={img.src} />
            ))}
          </DroppableBox>
          <DroppableBox id="box3" onDrop={handleDrop}>
            {boxes.box3.map((img) => (
              <DraggableImage key={img.id} id={img.id} src={img.src} />
            ))}
          </DroppableBox>
        </div>
      </section>
    </DndProvider>
  );
};

export default ExerciseDetails;






/* zu übernehmen 



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  const [exercise, setExercise] = useState(null);
  const [boxes, setBoxes] = useState({
    box1: [],
    box2: [],
    box3: [],
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
        <h1 className="heading">{exercise.title}</h1>
        <div className="row">
          <div className="column">
            <div className="thumb">
              <img src={exercise.img} alt={exercise.title} />
              <span>{exercise.title}</span>
            </div>
          </div>
          <div className="column">
            <div className="tutor">
              <img src={exercise.img} alt={exercise.title} />
              <div>
                <h3>{exercise.title}</h3>
                <span>{exercise.date}</span>
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
        <h1 className="heading">Ex Elements</h1>
        <div className="box-container">
          <DroppableBox id="box1" onDrop={handleDrop}>
            {boxes.box1.map((img) => (
              <DraggableImage key={img.id} id={img.id} src={img.src} />
            ))}
          </DroppableBox>
          <DroppableBox id="box2" onDrop={handleDrop}>
            {boxes.box2.map((img) => (
              <DraggableImage key={img.id} id={img.id} src={img.src} />
            ))}
          </DroppableBox>
          <DroppableBox id="box3" onDrop={handleDrop}>
            {boxes.box3.map((img) => (
              <DraggableImage key={img.id} id={img.id} src={img.src} />
            ))}
          </DroppableBox>
        </div>
      </section>
    </DndProvider>
  );
};

export default ExerciseDetails;
*/