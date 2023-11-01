import React, { useState, useEffect } from 'react';
import './InsertEvent.css';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';

function InsertEvent({ onClose, onEventAdded }) {
  const [selectedSection, setSelectedSection] = useState('bsit'); // Initialize with 'bsit' 
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    professor: '',
  });

  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    // Fetch the professors from the Firestore collection and populate the dropdown.
    const fetchProfessors = async () => {
      const professorCollection = collection(db, 'teacher_subject');
      const professorSnapshot = await getDocs(professorCollection);

      const professorData = [];
      professorSnapshot.forEach((doc) => {
        const professor = doc.data();
        professorData.push(professor);
      });

      setProfessors(professorData);
    };

    fetchProfessors();
  }, []); // Empty dependency array to ensure this effect runs only once.

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") {
      // If the select input is for "title" (Professor & Subject),
      // you can set the state with teacherName in Title and subjectName in Professor.
      const professor = professors.find((prof) => prof.teacherName === value);
      setNewEvent({
        ...newEvent,
        title: professor.teacherName,
        professor: professor.subjectName,
      });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'schedules'), {
        Title: newEvent.title,
        Start: new Date(`${newEvent.date} ${newEvent.startTime}`),
        End: new Date(`${newEvent.date} ${newEvent.endTime}`),
        Professor: newEvent.professor,
      });

      onEventAdded({
        id: docRef.id,
        Title: newEvent.title,
        Start: new Date(`${newEvent.date} ${newEvent.startTime}`),
        End: new Date(`${newEvent.date} ${newEvent.endTime}`),
        Professor: newEvent.professor,
      });

      onClose();

      setNewEvent({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        professor: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  

  return (
    <div>
      <form className="formcon" onSubmit={handleSubmit}>
      <div className="group">
          <label htmlFor="professor">Professor & Subject:</label>
          <select
            name="title"
            value={newEvent.title}
            onChange={handleChange}
            required
          >
            <option value="">Select a Professor</option>
            {professors.map((professor) => (
              <option key={professor.Email} value={professor.teacherName}>
                {professor.teacherName} - {professor.subjectName}
              </option>
            ))}
          </select>
        </div>
        <div className='group'>
          <select value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)}>
          <option value="bsit">BSIT</option>
          <option value="bsba">BSBA</option>
          <option value="hrs">HRS</option>
        </select>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            required
          />
          <label htmlFor="date">Date:</label>
        </div>
        <div className="timecon">
          <div className="group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              placeholder=""
              type="time"
              name="startTime"
              id="startTime"
              value={newEvent.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="group">
            <label htmlFor="endTime">End Time:</label>
            <input
              placeholder=""
              type="time"
              name="endTime"
              id="endTime"
              value={newEvent.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
       
        <div>
          <button type="submit">Add Event</button>
        </div>
      </form>
    </div>
  );
}

export default InsertEvent;
