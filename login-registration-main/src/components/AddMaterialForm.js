import React, { useState } from 'react';

const AddMaterialForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [exerciseId, setExerciseId] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('exerciseId', exerciseId);
    if (file) {
      formData.append('file', file);
    }
    onAdd(formData);
    setTitle('');
    setLink('');
    setExerciseId('');
    setFile(null);
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
        <label htmlFor="materialLink">Link (optional)</label>
        <input 
          type="url" 
          className="form-control" 
          id="materialLink" 
          value={link} 
          onChange={(e) => setLink(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label htmlFor="materialFile">File (optional)</label>
        <input 
          type="file" 
          className="form-control" 
          id="materialFile" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
      </div>
      <div className="form-group">
        <label htmlFor="exerciseId">Exercise ID</label>
        <input 
          type="text" 
          className="form-control" 
          id="exerciseId" 
          value={exerciseId} 
          onChange={(e) => setExerciseId(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Material</button>
    </form>
  );
};

export default AddMaterialForm;
