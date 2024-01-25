import React, { useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firestore';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './AddSubject.css';

function AddSubject() {
  const [newSubject, setNewSubject] = useState({
    subjectname: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if the subject name is empty
    if (newSubject.subjectname.trim() === '') {
      alert('Please enter a subject!');
      return; // Stop execution if the subject name is empty
    }
  
    try {
      // Check if the subject name already exists
      const subjectQuery = collection(db, 'subject');
      const querySnapshot = await getDocs(query(subjectQuery, where('Subjectname', '==', newSubject.subjectname)));
  
      if (!querySnapshot.empty) {
        // Subject name already exists, display an alert
        alert('Subject already exists!');
      } else {
        // Subject name does not exist, proceed to add the document
        const docRef = await addDoc(subjectQuery, {
          Subjectname: newSubject.subjectname
        });
  
        console.log('Document written with ID: ', docRef.id);
  
        // Clear the form inputs after successful addition
        setNewSubject({
          subjectname: ''
        });
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  

  return (
    <Row className='mb-3'>
      <Col sm={8}>
        <Form.Group controlId='subjectName'>
          <Form.Control
            type='text'
            placeholder='Enter Subject'
            name='subjectname'
            value={newSubject.subjectname}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
      <Col sm={4}>
        <Button variant='primary' onClick={handleSubmit}>
          Add Subject
        </Button>
      </Col>
    </Row>
  );
}

export default AddSubject;
