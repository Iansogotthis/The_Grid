import React, { useState } from "react";
import Chart from "./components/Chart";
import Modal from "./components/Modal";
import FormModal from "./components/FormModal";
import "./App.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [currentSquare, setCurrentSquare] = useState(null);
  const [formMode, setFormMode] = useState(""); // new state for form mode

  const openModal = (square) => {
    setCurrentSquare(square);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLabel("");
  };

  const saveLabel = () => {
    // Logic to save the label
    closeModal();
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
    closeModal();
  };

  const handleExclude = () => {
    setFormMode("exclude");
    setIsFormModalOpen(true);
    closeModal();
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const submitForm = (event) => {
    event.preventDefault();
    const data = event.target.data.value;
    // Logic to handle form submission
    closeFormModal();
  };

  return (
    <div className="App">
      <h1>Square Data Management App</h1>
      <Chart onSquareClick={openModal} />
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
        onSubmit={submitForm}
        mode={formMode}
      />
    </div>
  );
};

export default App;
