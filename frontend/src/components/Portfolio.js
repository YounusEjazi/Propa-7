import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const token = localStorage.getItem('token'); // Assume you store token in localStorage
      const response = await axios.get('http://localhost:3000/get-portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolios(response.data.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleFolderChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    // formData.append('portfolioFiles', files[0]);
    console.log(files);
    for (const file of files) {
      formData.append('portfolioFiles', file);
    }

    formData.append('folderName', folderName);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/add-portfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      fetchPortfolios(); // Refresh portfolios after adding
    } catch (error) {
      console.error('Error adding portfolio:', error);
    }
  };

  const handleDelete = async (folderName, fileId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/delete-portfolio-file', {
        headers: { Authorization: `Bearer ${token}` },
        data: { folderName, fileId }
      });
      fetchPortfolios(); // Refresh portfolios after deleting
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="portfolio">
      <h1>Portfolio</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={folderName}
          onChange={handleFolderChange}
          placeholder="Folder Name"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          required
        />
        <button type="submit">Add Files</button>
      </form>
      <div className="portfolio-list">
        {portfolios.map(portfolio => (
          <div key={portfolio._id} className="portfolio-folder">
            <h2>{portfolio.folderName}</h2>
            <ul>
              {portfolio.files.map(file => (
                <li key={file._id}>
                  <a href={file.filePath} target="_blank" rel="noopener noreferrer">{file.title}</a>
                  <button onClick={() => handleDelete(portfolio.folderName, file._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
