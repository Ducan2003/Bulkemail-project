import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [host, setHost] = useState('');
  const [file, setFile] = useState(null);

  const handleCreateEmail = async () => {
    try {
      const response = await axios.post('/create-email', { firstName, lastName, host });
      alert('Email created: ' + response.data.email);
    } catch (error) {
      alert('Error creating email');
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload-emails', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Emails created: ' + response.data.map((email) => email.email).join(', '));
    } catch (error) {
      alert('Error uploading file');
    }
  };

  return (
    <div className="App">
      <h1>Create Email Alias</h1>
      
      <div>
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Email Host" 
          value={host} 
          onChange={(e) => setHost(e.target.value)} 
        />
        <button onClick={handleCreateEmail}>Create Email</button>
      </div>

      <div>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button onClick={handleFileUpload}>Upload and Create Emails</button>
      </div>
    </div>
  );
}

export default App;
