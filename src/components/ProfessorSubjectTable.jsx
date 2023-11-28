import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';

function ProfessorSubjectTable() {
  const [professorSubjects, setProfessorSubjects] = useState([]);

  // Use the useEffect hook to fetch the professor-subject assignments from Firestore when the component mounts
  useEffect(() => {
    const fetchProfessorSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teacher_subject'));
        const professorSubjectList = [];
        querySnapshot.forEach((doc) => {
          professorSubjectList.push({ id: doc.id, ...doc.data() });
        });
        setProfessorSubjects(professorSubjectList);
      } catch (error) {
        console.error('Error fetching professor-subject assignments: ', error);
      }
    };
    fetchProfessorSubjects();
  }, []);

  return (
    <div>
      <h1>Professor-Subject Assignments</h1>
      <table>
        <thead>
          <tr>
            <th>Professor</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          {professorSubjects.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.teacherName}</td> {/* You may need to map professor names from another collection */}
              <td>{assignment.subjectName}</td> {/* You may need to map subject names from another collection */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfessorSubjectTable;
