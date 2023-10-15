import React, { useState } from 'react';
import './CreateUser.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
function CreateUser({ onClose, onStudentAdded, section}) {
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentNo: "",
    section: "",
    email: "",
    password: ""
  });
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newStudent.email,
        newStudent.password
      );
  
      const user = userCredential.user;
      console.log('User created:', user);
  
      // Now you can proceed to add student data to Firestore
      const docRef = await addDoc(collection(db, section), {
        Name: newStudent.name,
        Studentno: newStudent.studentNo,
        Section: newStudent.section,
        Email: newStudent.email,
        Password: newStudent.password,
      });
  
      // Call the onStudentAdded callback with the new student data
      onStudentAdded({
        Name: newStudent.name,
        Studentno: newStudent.studentNo,
        Section: newStudent.section,
        Email: newStudent.email,
        Password: newStudent.password,
      });
  
      console.log('Document written with ID: ', docRef.id);
  
      // Close the CreateUser modal after successful addition
      onClose();
  
      // Clear the form inputs after successful addition
      setNewStudent({
        name: '',
        studentNo: '',
        section: '',
        email: '',
        password: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Add Student</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value={newStudent.name}
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
            value={newStudent.studentNo}
            onChange={handleChange}
            required
          />
          <label htmlFor="studentno">Student No:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="section"
            value={newStudent.section}
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
            value={newStudent.email}
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
            value={newStudent.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password:</label>
        </div>

        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
