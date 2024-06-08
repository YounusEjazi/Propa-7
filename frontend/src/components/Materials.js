// src/components/Materials.js
import React, { useState, useEffect } from 'react';
import AddMaterialForm from './AddMaterialForm';

const Materials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/materials')
      .then(response => response.json())
      .then(data => setMaterials(data.data));
  }, []);

  const handleAddMaterial = (material) => {
    fetch('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(material)
    })
    .then(response => response.json())
    .then(data => setMaterials([...materials, data.data]));
  };

  const deleteMaterial =  (material) => {
     fetch('http://localhost:3000/api/materials', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        id: material._id
      })
    })
    .then(response => response.json())
    .then(() => setMaterials(materials.filter(mat => mat._id !== material._id)));;
  }

  return (
    <div className="container">
      <h1>Unterstützende Material</h1>
      <AddMaterialForm onAdd={handleAddMaterial} />
      <ul>
        {materials.map((material, index) => (
          <li key={index}>
            <a href={material.link} target="_blank" rel="noopener noreferrer">{material.title}</a>
            {material.link.includes('youtube.com') && (
              <iframe
                width="560"
                height="315"
                src={material.link.replace('watch?v=', 'embed/')}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            <button onClick={() => deleteMaterial(material)}> Delete </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Materials;
