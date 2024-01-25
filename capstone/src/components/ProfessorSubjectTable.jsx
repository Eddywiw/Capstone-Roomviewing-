import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { ListGroup, Button } from 'react-bootstrap';
import './ProfessorSubjectTable.css';

function ProfessorSubjectTable() {
  const [professorSubjects, setProfessorSubjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'teacher_subject'), (querySnapshot) => {
      const professorSubjectList = [];
      querySnapshot.forEach((doc) => {
        professorSubjectList.push({ id: doc.id, ...doc.data() });
      });
      setProfessorSubjects(professorSubjectList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run the effect only once on mount

  const handleRemoveClick = async (assignmentId) => {
    try {
      // Ask for confirmation
      const confirmDelete = window.confirm('Are you sure you want to remove this?');

      if (!confirmDelete) {
        return; // If user cancels, do nothing
      }

      // Create a reference to the document in the teacher_subject collection
      const assignmentRef = doc(db, 'teacher_subject', assignmentId);
      
      // Delete the document
      await deleteDoc(assignmentRef);

      // You may want to update the state to reflect the removal immediately
      setProfessorSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== assignmentId));
      
      console.log('Assignment removed successfully.');
    } catch (error) {
      console.error('Error removing assignment: ', error);
    }
  };

  return (
    <div>
      <ListGroup>
        {professorSubjects.map((assignment) => (
          <ListGroup.Item key={assignment.id} className='d-flex justify-content-between align-items-center' style={{ gap: 100 }}>
            <div>
              <span>{assignment.teacherName}</span>
              <br />
              <small className='text-muted'>{assignment.subjectName}</small>
            </div>
            <Button
              variant='danger'
              onClick={() => handleRemoveClick(assignment.id)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ProfessorSubjectTable;
