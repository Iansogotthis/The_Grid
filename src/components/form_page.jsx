import React, { useState } from 'react';

const FormPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    plane: '',
    purpose: '',
    delineator: '',
    notations: '',
    details: '',
    extraData: '',
    name: '',
    size: '',
    color: '',
    type: '',
    parent_id: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const saveFormData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      ...formData,
      class: urlParams.get('class'),
      parent: urlParams.get('parent'),
      depth: urlParams.get('depth')
    };

    fetch('/squares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.location.href = 'included_build.html'; // Redirect or update the state as needed
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to save data. Please try again.');
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Form Page</h1>
      <form id="square-form">
        {['title', 'plane', 'purpose', 'delineator', 'notations', 'name', 'size', 'color', 'type', 'parent_id'].map((field, index) => (
          <div className="form-group" key={field} style={{ marginBottom: '15px', width: '100%', maxWidth: '500px' }}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input type="text" id={field} value={formData[field]} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        ))}
        <button type="button" onClick={saveFormData} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Save</button>
      </form>
    </div>
  );
};

export default FormPage;