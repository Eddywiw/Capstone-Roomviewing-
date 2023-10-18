import React, { useState } from 'react';
import './CreateUser.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
function CreateProfessor({ onClose, onStudentAdded}) {
  const [newProfesor, setNewProfessor] = useState({
    name: "",
    position: "",
    email: "",
    password: ""
  });
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProfessor({ ...newProfesor, [name]: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newProfesor.email,
        newProfesor.password
      );
  
      const user = userCredential.user;
      console.log('User created:', user);
  
      // Now you can proceed to add student data to Firestore
      const docRef = await addDoc(collection(db, 'professor'), {
        Name: newProfesor.name,
        Position: newProfesor.position,
        Email: newProfesor.email,
        Password: newProfesor.password,
      });
  
      // Call the onStudentAdded callback with the new student data
      onStudentAdded({
        Name: newProfesor.name,
        Position: newProfesor.position,
        Email: newProfesor.email,
        Password: newProfesor.password,
      });
  
      console.log('Document written with ID: ', docRef.id);
  
      // Close the CreateUser modal after successful addition
      onClose();
  
      // Clear the form inputs after successful addition
      setNewProfessor({
        name: '',
        position: '',
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
            value={newProfesor.name}
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
            value={newProfesor.position}
            onChange={handleChange}
            required
          />
          <label htmlFor="studentno">Position:</label>
        </div>

        <div className="group">
          <input
            placeholder=""
            type="text"
            name="email"
            value={newProfesor.email}
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
            value={newProfesor.password}
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

export default CreateProfessor;
