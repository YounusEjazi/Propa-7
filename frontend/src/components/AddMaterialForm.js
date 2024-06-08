// src/components/AddMaterialForm.js
import React, { useState } from 'react';

const AddMaterialForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, link });
    setTitle('');
    setLink('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="materialTitle">Title</label>
        <input 
          type="text" 
          className="form-control" 
          id="materialTitle" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="materialLink">Link</label>
        <input 
          type="url" 
          className="form-control" 
          id="materialLink" 
          value={link} 
          onChange={(e) => setLink(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Material</button>
    </form>
  );
};

export default AddMaterialForm;
