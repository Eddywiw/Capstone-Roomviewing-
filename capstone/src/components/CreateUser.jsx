import React, { useState, useEffect } from 'react';
import './CreateUser.css';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../config/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
function CreateUser({ onClose, onStudentAdded, section}) {
  const [newStudent, setNewStudent] = useState({
    enrollmentStatus: "",
    name: "",
    studentNo: "",
    course: "",
    section: "",
    email: "",
    password: "",
    
  });
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Fetch the sections from the Firestore collection and populate the dropdown.
    const fetchSections = async () => {
      const sectionsCollection = collection(db, 'section');
      const sectionsSnapshot = await getDocs(sectionsCollection);

      const sectionData = [];
      sectionsSnapshot.forEach((doc) => {
        const section = doc.data();
        sectionData.push(section);
      });

      setSections(sectionData);
    };

    fetchSections();
  }, []); // Empty dependency array to ensure this effect runs only once.
    

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const [existingStudents, setExistingStudents] = useState([]); 
  useEffect(() => {
    // Fetch existing students on component mount
    getExistingStudents();
  }, []);

  const getExistingStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, section));
      const existingStudentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExistingStudents(existingStudentsData);
    } catch (error) {
      console.error("Error fetching existing students: ", error);
    }
  };


  async function handleSubmit(event) {
    event.preventDefault();
  
    const existingStudent = existingStudents.find((student) => {
      const existingStudentNo = String(student.Studentno).toLowerCase();
      const newStudentNo = String(newStudent.studentNo).toLowerCase();
      return existingStudentNo === newStudentNo;
    });
  
    if (existingStudent) {
      alert('A user with the same student number already exists. Please use a different student number.');
      return;
    }
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newStudent.email,
        newStudent.password
      );
  
      const user = userCredential.user;
      console.log('User created:', user);
  
      // Now you can proceed to add student data to Firestore
      const docRef = await addDoc(collection(db, section), {
        EnrollmentStatus: newStudent.enrollmentStatus,
        Name: newStudent.name,
        Studentno: newStudent.studentNo,
        Course: newStudent.course,
        Section: newStudent.section,
        Email: newStudent.email,
        Password: newStudent.password,
      });
  
      // Call the onStudentAdded callback with the new student data
      onStudentAdded({
        EnrollmentStatus: newStudent.enrollmentStatus,
        Name: newStudent.name,
        Studentno: newStudent.studentNo,
        Course: newStudent.course,
        Section: newStudent.section,
        Email: newStudent.email,
        Password: newStudent.password,
      });
  
      console.log('Document written with ID: ', docRef.id);
  
      // Close the CreateUser modal after successful addition
      onClose();
  
      // Clear the form inputs after successful addition
      setNewStudent({
        enrollmentStatus: '',
        name: '',
        studentNo: '',
        course: "",
        section: '',
        email: '',
        password: '',
      });
  
      // Refresh the existingStudents array after successful addition
      getExistingStudents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
  
  
  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Add Student</span>
      <form className="form" onSubmit={handleSubmit}>
      <div className="group">
          <label htmlFor="enrollmentStatus">Enrollment Status:</label>
          <select
            name="enrollmentStatus"
            value={newStudent.enrollmentStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value={newStudent.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Name:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="studentNo"
            value={newStudent.studentNo}
            onChange={handleChange}
            required
          />
          <label htmlFor="studentno">Student No:</label>
        </div>

        <div className="group">
          <label htmlFor="course">Course:</label>
          <select
            name="course"
            value={newStudent.course}
            onChange={handleChange}
            required
          >
            <option value="">Select Course/Strand</option>
            <option value="BSIT">BSIT</option>
            <option value="BSBA">BSBA</option>
            <option value="HRS">HRS</option>
            <option value="GAS">GAS</option>
            <option value="MAWD">MAWD</option>
            <option value="CULART">CULART</option>
            <option value="ABM">ABM</option>
          </select>
        </div>

        <div className="group">
          <label htmlFor="section">Section:</label>
          <select
            name="section"
            value={newStudent.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="BSIT 11-A">BSIT 11-A</option>
            <option value="BSIT 21-A">BSIT 21-A</option>
            <option value="BSIT 31-A">BSIT 31-A</option>
            <option value="BSIT 41-A">BSIT 41-A</option>
            <option value="BSBA 11-A">BSBA 11-A</option>
            <option value="BSBA 21-A">BSBA 21-A</option>
            <option value="BSBA 31-A">BSBA 31-A</option>
            <option value="BSBA 41-A">BSBA 41-A</option>
            <option value="HRS 11-A">HRS 11-A</option>
            <option value="HRS 21-A">HRS 21-A</option>
            <option value="GAS 11">GAS 11</option>
            <option value="GAS 12">GAS 12</option>
            <option value="MAWD 11">MAWD 11</option>
            <option value="MAWD 12">MAWD 12</option>
            <option value="CULART 11">CULART 11</option>
            <option value="CULART 12">CULART 12</option>
            <option value="ABM 11">ABM 11</option>
            <option value="ABM 12">ABM 12</option>
          </select>

        </div>


        
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="email"
            value={newStudent.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="password"
            value={newStudent.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password:</label>
        </div>

        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
