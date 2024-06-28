import React, { useState } from 'react';

const FormPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        plane: '',
        purpose: '',
        delineator: '',
        notations: '',
        details: '',
        extraData: ''
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

        fetch('http://localhost:3000/save_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = 'included_build.html';
            } else {
                alert("Error saving data: " + data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to save data. Please try again.');
        });
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Form Page</h1>
            <form id="square-form">
                {['title', 'plane', 'purpose', 'delineator', 'notations'].map((field, index) => (
                    <div className="form-group" key={field} style={{ marginBottom: '15px', width: '100%', maxWidth: '500px' }}>
                        <label htmlFor={field}>{`${field.charAt(0).toUpperCase() + field.slice(1)} (${index + 1}):`}</label>
                        <input type="text" id={field} value={formData[field]} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                ))}
                <div className="form-group" style={{ marginBottom: '15px', width: '100%', maxWidth: '500px' }}>
                    <label htmlFor="details">Details (6):</label>
                    <textarea id="details" value={formData.details} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', height: '100px' }}></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: '15px', width: '100%', maxWidth: '500px' }}>
                    <label htmlFor="extraData">Extra Data (17):</label>
                    <textarea id="extraData" value={formData.extraData} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', height: '100px' }}></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: '15px', width: '100%', maxWidth: '500px' }}>
                    <button type="button" id="save" onClick={saveFormData} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Save</button>
                </div>
            </form>
        </div>
    );
};

export default FormPage;
