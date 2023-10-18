import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/firestore';

function StudentTable({ selectedSection }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudentsInSection = async () => {
      try {
        if (selectedSection) { // Check if selectedSection is not empty or undefined
          const querySnapshot = await getDocs(collection(db, selectedSection));
          const studentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsData);
        }
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };
    getStudentsInSection();
  }, [selectedSection]);
  
  

  return (
    <div className='students-div'>
    <h2>Students in {selectedSection} Section</h2>
    <table className='students-table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Student no.</th>
          <th>Email</th>
          {/* Add more columns as needed */}
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td>{student.Name}</td>
            <td>{student.Studentno}</td>
            <td>{student.Email}</td>
            {/* Add more columns as needed */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

export default StudentTable;
