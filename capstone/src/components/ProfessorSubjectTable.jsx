import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
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

  return (
    <div>
      <ListGroup>
        {professorSubjects.map((assignment) => (
          <ListGroup.Item key={assignment.id} className='d-flex justify-content-between align-items-center'style={{ gap: 100 }}>
            <div>
              <span>{assignment.teacherName}</span>
              <br />
              <small className='text-muted'>{assignment.subjectName}</small>
            </div>
            <Button variant='danger' className='deletebtnko'>
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ProfessorSubjectTable;
