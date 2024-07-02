import React, { useState } from "react";
import Chart from "./components/Chart";
import Modal from "./components/Modal";
import FormModal from "./components/FormModal";
import './App.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [currentSquare, setCurrentSquare] = useState(null);
  const [formMode, setFormMode] = useState(""); // new state for form mode
  const [squareData, setSquareData] = useState({}); // State to manage square data

  const openModal = (square) => {
    setCurrentSquare(square);
    setLabel(square.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLabel("");
  };

  const saveLabel = () => {
    if (currentSquare) {
      const updatedSquareData = {
        ...currentSquare,
        title: label // Update the title
      };

      fetch(`/save-square`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSquareData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setCurrentSquare(updatedSquareData);
        closeModal();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  const handleScaledView = () => {
    // Logic for scaled view
    closeModal();
  };

  const handleScopedView = () => {
    // Logic for scoped view
    closeModal();
  };

  const handleInclude = () => {
    setFormMode("include");
    setIsFormModalOpen(true);
  };

  const handleExclude = () => {
    setFormMode("exclude");
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1>Square Data Management App</h1>
      <Chart onSquareClick={openModal} onDataLoad={setSquareData} />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveLabel}
        label={label}
        setLabel={setLabel}
        onScaledView={handleScaledView}
        onScopedView={handleScopedView}
        onInclude={handleInclude}
      />
      <FormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        mode={formMode}
        squareData={squareData}
      />
    </div>
  );
};

export default App;
