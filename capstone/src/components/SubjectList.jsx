import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firestore';
import './SubjectList.css';

function SubjectList() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(collection(db, 'subject'), (querySnapshot) => {
      const subjectList = [];
      querySnapshot.forEach((doc) => {
        subjectList.push({ id: doc.id, ...doc.data() });
      });
      setSubjects(subjectList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="subject-list-container">
      <h1>Subject List</h1>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            <span>{subject.Subjectname}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectList;
