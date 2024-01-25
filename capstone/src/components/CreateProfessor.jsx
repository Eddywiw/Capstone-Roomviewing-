import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../config/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Modal, Button, Form } from 'react-bootstrap';
import './CreateUser.css';

function CreateProfessor({ onClose, onStudentAdded, getProfessor }) {
  const [newProfessor, setNewProfessor] = useState({
    name: "",
    professorid: "",
    position: "",
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProfessor({ ...newProfessor, [name]: value });
  };
  const [existingStudents, setExistingStudents] = useState([]);
  useEffect(() => {
    // Fetch existing students on component mount
    getExistingStudents();
  }, []);

  const getExistingStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "professor"));
      const existingStudentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExistingStudents(existingStudentsData);
    } catch (error) {
      console.error("Error fetching existing students: ", error);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const existingStudent = existingStudents.find((professor) => {
      const existingStudentNo = String(professor.ProfessorID).toLowerCase();
      const newStudentNo = String(newProfessor.professorid).toLowerCase();
      return existingStudentNo === newStudentNo;
    });

    if (existingStudent) {
      alert('A user with the same profossor id already exists. Please use a different professor id.');
      return;
    }
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newProfessor.email,
        newProfessor.password
      );

      const user = userCredential.user;
      console.log('User created:', user);

      // Now you can proceed to add professor data to Firestore
      const docRef = await addDoc(collection(db, 'professor'), {
        Name: newProfessor.name,
        ProfessorID: newProfessor.professorid,
        Position: newProfessor.position,
        Email: newProfessor.email,
        Password: newProfessor.password,
      });

      // Call the onStudentAdded callback with the new professor data
      onStudentAdded({
        Name: newProfessor.name,
        ProfessorID: newProfessor.professorid,
        Position: newProfessor.position,
        Email: newProfessor.email,
        Password: newProfessor.password,
      });

      console.log('Document written with ID: ', docRef.id);

      // Close the CreateUser modal after successful addition
      onClose();

      // Display alert when the professor is successfully added
      window.alert("Professor successfully added!");

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
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Professor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newProfessor.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProfessorID">
            <Form.Label>ProfessorID:</Form.Label>
            <Form.Control
              type="text"
              name="professorid"
              value={newProfessor.professorid}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPosition">
            <Form.Label>Position:</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={newProfessor.position}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={newProfessor.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={newProfessor.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateProfessor;
