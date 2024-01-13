import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
function SubjectArchives() {
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        // Set up a real-time listener using onSnapshot
        const unsubscribe = onSnapshot(collection(db, 'subjectArchives'), (querySnapshot) => {
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
    <div>
        <ul>
        {subjects.map((subject) => (
          <div className='listdiv' key={subject.id}>
            <li>
              <span>{subject.Subjectname}</span>
            </li>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default SubjectArchives