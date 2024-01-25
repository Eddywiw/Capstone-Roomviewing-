import React, { useState } from 'react';
import './UpdateUser.css';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateProfessor({ onClose, currentProf, getProfessor }) {
  const [updatedProfessor, setUpdatedProfessor] = useState({
    name: currentProf.Name,
    professorid: currentProf.ProfessorID,
    position: currentProf.Position,
    email: currentProf.Email,
    password: currentProf.Password,
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
        ProfessorID: updatedProfessor.professorid,
        Position: updatedProfessor.position,
        Email: updatedProfessor.email,
        Password: updatedProfessor.password,
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
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Professor Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={updatedProfessor.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProfessorID">
            <Form.Label>ProfessorID:</Form.Label>
            <Form.Control
              type="text"
              name="professorid"
              value={updatedProfessor.professorid}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPosition">
            <Form.Label>Position:</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={updatedProfessor.position}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={updatedProfessor.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="text"
              name="password"
              value={updatedProfessor.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateProfessor;
