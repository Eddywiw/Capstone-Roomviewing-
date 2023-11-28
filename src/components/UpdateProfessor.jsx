import React, { useState } from 'react';
import './UpdateUser.css';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';

function UpdateProfessor({ onClose, currentProf, getProfessor}) {

  const [updatedProfessor, setUpdatedProfessor] = useState({
    name: currentProf.Name,
    position: currentProf.Position,
    email: currentProf.Email,
    password: currentProf.Password
  });

  const [isUpdating, setIsUpdating] = useState(false); // State to control button disabling

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProfessor({ ...updatedProfessor, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true); // Disable the button during update

    try {
      const professorRef = doc(db, 'professor', currentProf.id);
      await updateDoc(professorRef, {
        Name: updatedProfessor.name,
        Position: updatedProfessor.position,
        Email: updatedProfessor.email,
        Password: updatedProfessor.password
      });

      // Close the UpdateUser modal after successful update
      onClose();
    } catch (error) {
      console.error('Error updating document: ', error);
    }

    setIsUpdating(false); // Re-enable the button after update
    await getProfessor(); // Refresh the student data
  };

  return (
    <div className="updatemain">
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span>Update Professor Information</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value={updatedProfessor.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Name:</label>
        </div>
       
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="position"
            value={updatedProfessor.position}
            onChange={handleChange}
            required
          />
          <label htmlFor="position">Position:</label>
        </div>

        <div className="group">
          <input
            placeholder=""
            type="text"
            name="email"
            value={updatedProfessor.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email:</label>
        </div>

        <div className="group">
          <input
            placeholder=""
            type="text"
            name="password"
            value={updatedProfessor.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password:</label>
        </div>

        <button className="updatestubtn" type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}

export default UpdateProfessor;
