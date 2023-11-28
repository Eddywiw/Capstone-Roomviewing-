import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firestore';

function AssignProf() {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]); // Add subject list state
  
  // Use the useEffect hook to fetch professors and subjects from Firestore when the component mounts
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const professorSnapshot = await getDocs(collection(db, 'professor'));
        const professorList = [];
        professorSnapshot.forEach((doc) => {
          professorList.push({ id: doc.id, ...doc.data() });
        });
        setProfessors(professorList);
      } catch (error) {
        console.error('Error fetching professors: ', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subject'));
        const subjectList = [];
        querySnapshot.forEach((doc) => {
          subjectList.push({ id: doc.id, ...doc.data() });
        });
        setSubjectList(subjectList); // Set subject list state
      } catch (error) {
        console.error('Error fetching subjects: ', error);
      }
    };
    
    fetchProfessors();
    fetchSubjects();
  }, []);

  const handleProfessorChange = (event) => {
    setSelectedProfessor(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleAssign = async () => {
    if (selectedProfessor && selectedSubject) {
      try {
        // Fetch the name of the selected professor
        const professorRef = doc(db, 'professor', selectedProfessor);
        const professorSnap = await getDoc(professorRef);
        const professorName = professorSnap.data().Name;
        
        // Fetch the name of the selected subject
        const subjectRef = doc(db, 'subject', selectedSubject);
        const subjectSnap = await getDoc(subjectRef);
        const subjectName = subjectSnap.data().Subjectname;

        // Create a new document in the "teacher_subject" collection with IDs and names
        await addDoc(collection(db, "teacher_subject"), {
          teacherId: selectedProfessor,
          teacherName: professorName,
          subjectId: selectedSubject,
          subjectName: subjectName,
        });

        // Reset the selected values after assignment
        setSelectedProfessor('');
        setSelectedSubject('');

        console.log("Teacher assigned to subject.");
      } catch (error) {
        console.error("Error assigning teacher: ", error);
      }
    } else {
      console.error("Please select both a teacher and a subject.");
    }
  };

  return (
    <div>
      <h1>Assign Professor</h1>
      <label htmlFor="professorSelect">Select a Professor:</label>
      <select
        id="professorSelect"
        value={selectedProfessor}
        onChange={handleProfessorChange}
      >
        <option value="">Select a Professor</option>
        {professors.map((professor) => (
          <option key={professor.id} value={professor.id}>
            {professor.Name}
          </option>
        ))}
      </select>

      <label htmlFor="subjectSelect">Select a Subject:</label>
      <select
        id="subjectSelect"
        value={selectedSubject}
        onChange={handleSubjectChange}
      >
        <option value="">Select a Subject</option>
        {subjectList.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.Subjectname}
          </option>
        ))}
      </select>

      <button onClick={handleAssign}>Assign Professor to Subject</button>
    </div>
  );
}

export default AssignProf;
