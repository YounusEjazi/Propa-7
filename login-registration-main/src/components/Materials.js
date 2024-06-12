import React, { useState, useEffect } from 'react';
import AddMaterialForm from './AddMaterialForm';

const Materials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/get-materials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then(response => response.json())
      .then(data => setMaterials(data.data));
  }, []);

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
      body: JSON.stringify({
        id: material._id
      })
    })
    .then(response => response.json())
    .then(() => setMaterials(materials.filter(mat => mat._id !== material._id)));
  }

  return (
    <div className="container">
      <h1>Supporting Materials</h1>
      <AddMaterialForm onAdd={handleAddMaterial} />
      <ul>
        {materials.map((material, index) => (
          <li key={index}>
            <h3>{material.title}</h3>
            {material.link ? (
              <a href={material.link} target="_blank" rel="noopener noreferrer">{material.link}</a>
            ) : (
              <a href={`http://localhost:3000${material.filePath}`} target="_blank" rel="noopener noreferrer">Download File</a>
            )}
            {material.link && material.link.includes('youtube.com') && (
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
