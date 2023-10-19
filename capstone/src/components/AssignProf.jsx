import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';

function AssignProf() {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [courses, setCourses] = useState([]); // Add the 'courses' state
  const [selectedCourse, setSelectedCourse] = useState('');


  // Use the useEffect hook to fetch professors and courses from Firestore when the component mounts
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

    const fetchCourses = async () => {
      try {
        const bsitSnapshot = await getDocs(collection(db, 'bsit'));
        const hrsSnapshot = await getDocs(collection(db, 'hrs'));
        const bsbaSnapshot = await getDocs(collection(db, 'bsba'));

        const courseList = [];

        bsitSnapshot.forEach((doc) => {
          courseList.push({ id: doc.id, ...doc.data(), courseName: 'BSIT' });
        });

        hrsSnapshot.forEach((doc) => {
          courseList.push({ id: doc.id, ...doc.data(), courseName: 'HRS' });
        });

        bsbaSnapshot.forEach((doc) => {
          courseList.push({ id: doc.id, ...doc.data(), courseName: 'BSBA' });
        });

        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching courses: ', error);
      }
    };

    fetchProfessors();
    fetchCourses();
  }, []);

  const handleProfessorChange = (event) => {
    setSelectedProfessor(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
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

      <br />

      <label htmlFor="courseSelect">Select a Course:</label>
      <select
        id="courseSelect"
        value={selectedCourse}
        onChange={handleCourseChange}
      >
        <option value="">Select a Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.courseName} - {course.CourseName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AssignProf;
