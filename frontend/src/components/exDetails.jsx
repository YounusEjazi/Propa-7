import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import './exDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import AddMaterialForm from './AddMaterialForm';

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

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
  }, [src]);

  return (
    <div ref={drag} className="image-wrapper" style={{ width: dimensions.width, height: dimensions.height, opacity: isDragging ? 0.5 : 1 }}>
      <div className="circular-border">
        <img src={src} alt="" className="draggable-image" style={{ width: '100%', height: '100%' }} />
      </div>
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
    box1: [
      { id: 1, src: '/Tragwerkelemente/le/Bögen.png' },
      { id: 2, src: '/Tragwerkelemente/le/Seil.png' },
      { id: 3, src: '/Tragwerkelemente/le/Biegträger.png' },
      { id: 4, src: '/Tragwerkelemente/le/Stab.png' },
      { id: 5, src: '/Tragwerkelemente/le/Rahmen.png' },
      { id: 6, src: '/Tragwerkelemente/le/Druckstab.png' },
      { id: 7, src: '/Tragwerkelemente/le/Zugstab.png' },
      { id: 8, src: '/Tragwerkelemente/le/Fachwerkträger.png' },
      { id: 9, src: '/Tragwerkelemente/le/Rahmenträger.png' },
      { id: 10, src: '/Tragwerkelemente/le/Eingespannter Rahmen.png' },
      { id: 11, src: '/Tragwerkelemente/le/Zweigelenkrahmen.png' }
    ],
    box2: [
      { id: 12, src: '/Tragwerkelemente/fügung/ecke.png' },
      { id: 13, src: '/Tragwerkelemente/fügung/fügung.png' },
      { id: 14, src: '/Tragwerkelemente/fügung/gelenk.png' },
      { id: 15, src: '/Tragwerkelemente/fügung/gelenkigefügung.png' }
    ],
    box3: [
      { id: 16, src: '/Tragwerkelemente/auflager/fest.png' },
      { id: 17, src: '/Tragwerkelemente/auflager/gespannt.png' },
      { id: 18, src: '/Tragwerkelemente/auflager/verschieblich.png' }
    ],
    box4: [],
  });
  const [materials, setMaterials] = useState([]);

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

  useEffect(() => {
    fetch(`http://localhost:3000/get-materials/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setMaterials(data.data);
        } else {
          console.error('Failed to fetch materials');
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

  const handleAddMaterial = (material) => {
    fetch('http://localhost:3000/add-materials', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: material
    })
      .then(response => response.json())
      .then(data => setMaterials([...materials, data.data]));
  };

  const deleteMaterial = (material) => {
    fetch('http://localhost:3000/delete-material', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ id: material._id })
    })
      .then(response => response.json())
      .then(() => setMaterials(materials.filter(mat => mat._id !== material._id)));
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
              <img src={exercise.tutorProfilePicture ? `http://localhost:3000${exercise.tutorProfilePicture}` : '/user.png'} alt="Tutor" />
              <div>
                <h3>{exercise.createdBy}</h3> {/* Display the creator's name */}
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

      <section className="ex-elements">
        <h1 className="heading">Exercise Elements</h1>
        <div className="box-container1">
          <div className="box-header">
            <h2>Lineare Tragwerkelemente</h2>
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
            <h2>Auflager</h2>
            <DroppableBox key="box3" id="box3" onDrop={handleDrop}>
              {boxes.box3.map((img) => (
                <DraggableImage key={img.id} id={img.id} src={img.src} />
              ))}
            </DroppableBox>
          </div>
          <div className="box-header">
            <h2>Zuordnung</h2>
            <DroppableBox key="box4" id="box4" onDrop={handleDrop}>
              {boxes.box4.map((img) => (
                <DraggableImage key={img.id} id={img.id} src={img.src} />
              ))}
            </DroppableBox>
          </div>
        </div>
      </section>

      <section className="ex-videos">
        <h1 className="heading">Supportive Materials</h1>
        <div className="box-containerp">
          {materials.map(material => (
            <div className="box" key={material._id}>
              <div className="box-content">
                {material.link ? (
                  <a href={material.link} target="_blank" rel="noopener noreferrer">
                    <img src={`http://img.youtube.com/vi/${material.link.split('v=')[1]}/0.jpg`} alt={material.title} />
                    <i className="play-icon"><FontAwesomeIcon icon={faPlay} /></i>
                  </a>
                ) : (
                  <a href={`http://localhost:3000${material.filePath}`} target="_blank" rel="noopener noreferrer">
                    <img src={`http://localhost:3000${material.filePath}`} alt={material.title} />
                  </a>
                )}
                <h3>{material.title}</h3>
              </div>
              <button className="delete-button" onClick={() => deleteMaterial(material)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </DndProvider>
  );
};

export default ExerciseDetails;
