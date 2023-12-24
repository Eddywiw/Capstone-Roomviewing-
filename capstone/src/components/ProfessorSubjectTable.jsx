import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firestore';
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
      <table>
        <thead>
          <tr>
            <th>Professor</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {professorSubjects.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.teacherName}</td>
              <td>{assignment.subjectName}</td>
              <td>
                <div className='profeditcon'>
                  <button className='editbtnko'>Edit</button>
                  <button className='deletebtnko'>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfessorSubjectTable;
