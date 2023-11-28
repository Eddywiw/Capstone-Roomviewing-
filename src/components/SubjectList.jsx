import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';

function SubjectList() {
  const [subjects, setSubjects] = useState([]);

  // Use the useEffect hook to fetch subjects from Firestore when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subject'));
        const subjectList = [];
        querySnapshot.forEach((doc) => {
          subjectList.push({ id: doc.id, ...doc.data() });
        });
        setSubjects(subjectList);
      } catch (error) {
        console.error('Error fetching subjects: ', error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div>
      <h1>Subject List</h1>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>{subject.Subjectname}</li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectList;
