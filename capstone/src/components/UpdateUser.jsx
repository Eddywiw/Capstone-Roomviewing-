import React, { useState } from 'react';
import './UpdateUser.css';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateUser({ onClose, currentStudent, getStudent, section }) {
  const [updatedStudent, setUpdatedStudent] = useState({
    name: currentStudent.Name,
    studentNo: currentStudent.Studentno,
    course: currentStudent.Course,
    section: currentStudent.Section,
    email: currentStudent.Email,
    password: currentStudent.Password,
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
        Course: updatedStudent.course,
        Section: updatedStudent.section,
        Email: updatedStudent.email,
        Password: updatedStudent.password,
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
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Student Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={updatedStudent.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formStudentNo">
            <Form.Label>Student No:</Form.Label>
            <Form.Control
              type="text"
              name="studentNo"
              value={updatedStudent.studentNo}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCourse">
            <Form.Label>Course:</Form.Label>
            <Form.Control
              type="text"
              name="course"
              value={updatedStudent.course}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSection">
            <Form.Label>Section:</Form.Label>
            <Form.Control
              type="text"
              name="section"
              value={updatedStudent.section}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={updatedStudent.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="text"
              name="password"
              value={updatedStudent.password}
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

export default UpdateUser;
