import React, { useState } from 'react';
import './UpdateUser.css';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';

function UpdateUser({ onClose, currentStudent, getStudent, section }) {

  const [updatedStudent, setUpdatedStudent] = useState({
    name: currentStudent.Name,
    studentNo: currentStudent.Studentno,
    section: currentStudent.Section,
    email: currentStudent.Email,
    password: currentStudent.Password
  });

  const [isUpdating, setIsUpdating] = useState(false); // State to control button disabling

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true); // Disable the button during update

    try {
      const studentRef = doc(db, section, currentStudent.id);
      await updateDoc(studentRef, {
        Name: updatedStudent.name,
        Studentno: updatedStudent.studentNo,
        Section: updatedStudent.section,
        Email: updatedStudent.email,
        Password: updatedStudent.password
      });

      // Close the UpdateUser modal after successful update
      onClose();
    } catch (error) {
      console.error('Error updating document: ', error);
    }

    setIsUpdating(false); // Re-enable the button after update
    await getStudent(); // Refresh the student data
  };

  return (
    <div className="updatemain">
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span>Update Student Information</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value={updatedStudent.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Name:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="studentNo"
            value={updatedStudent.studentNo}
            onChange={handleChange}
            required
          />
          <label htmlFor="studentNo">Student No:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="section"
            value={updatedStudent.section}
            onChange={handleChange}
            required
          />
          <label htmlFor="section">Section:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="email"
            value={updatedStudent.email}
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
            value={updatedStudent.password}
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

export default UpdateUser;
