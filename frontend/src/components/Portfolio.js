import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Portfolio.module.css';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/get-portfolio-files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios(response.data.data);
    } catch (error) {
      setError('Error fetching portfolios.');
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
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
    for (const file of files) {
      formData.append('file', file);
    }
    formData.append('folderName', folderName);

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');

      // Check if folder exists
      const existingFolder = portfolios.find(portfolio => portfolio.folderName === folderName);

      if (existingFolder) {
        // Update existing folder
        await axios.post('http://localhost:3000/upload-portfolio-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create a new folder
        await axios.post('http://localhost:3000/upload-portfolio-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      fetchPortfolios();
    } catch (error) {
      setError('Error adding files.');
      console.error('Error adding portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (folderName, fileId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/delete-portfolio-files', {
        headers: { Authorization: `Bearer ${token}` },
        data: { folderName, fileId },
      });
      fetchPortfolios();
    } catch (error) {
      setError('Error deleting file.');
      console.error('Error deleting file:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (filePath) => {
    const baseURL = 'http://localhost:3000'; // Adjust to your server's base URL
    return `${baseURL}${filePath}`;
  };

  return (
    <div className={styles.portfolio}>
      <h1 className={styles.title}>Portfolio</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={folderName}
          onChange={handleFolderChange}
          placeholder="Folder Name"
          required
          className={styles.textInput}
        />
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          required
          className={styles.fileInput}
        />
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Adding Files...' : 'Add Files'}
        </button>
      </form>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.portfolioList}>
          {portfolios.map(portfolio => (
            <div key={portfolio._id} className={styles.portfolioFolder}>
              <h2 className={styles.folderTitle}>{portfolio.folderName}</h2>
              <ul className={styles.fileList}>
                {portfolio.files.map(file => (
                  <li key={file._id} className={styles.fileItem}>
                    <a href={getFileUrl(file.filePath)} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                      {file.title}
                    </a>
                    <button onClick={() => handleDelete(portfolio.folderName, file._id)} className={styles.deleteButton}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
