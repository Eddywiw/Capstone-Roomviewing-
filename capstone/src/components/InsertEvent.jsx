import React, { useState, useEffect } from 'react';
import './InsertEvent.css';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firestore';

function InsertEvent({ onClose, onEventAdded }) {
  const [selectedSection, setSelectedSection] = useState('bsit'); // Initialize with 'bsit' 
  const [newEvent, setNewEvent] = useState({
    title: '',
    roomNo: '',
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

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch the rooms from the Firestore collection and populate the dropdown.
    const fetchRooms = async () => {
      const roomsCollection = collection(db, 'rooms');
      const roomsSnapshot = await getDocs(roomsCollection);

      const roomData = [];
      roomsSnapshot.forEach((doc) => {
        const room = doc.data();
        roomData.push(room);
      });

      setRooms(roomData);
    };

    fetchRooms();
  }, []); // Empty dependency array to ensure this effect runs only once.

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      // If the select input is for "title" (Professor & Subject),
      // you can set the state with teacherName in Title and subjectName in Professor.
      const professor = professors.find((prof) => prof.teacherName === value);
      setNewEvent({
        ...newEvent,
        title: professor.teacherName,
        professor: professor.subjectName,
      });
    } else if (name === 'roomNo') {
      // If the select input is for "roomNo", update the state accordingly.
      setNewEvent({ ...newEvent, [name]: value });
    } else {
      // For other inputs, update the state as usual.
      setNewEvent({ ...newEvent, [name]: value });
    }
  };
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { roomNo, date, startTime, endTime } = newEvent;
  
      // Check for schedule conflicts
      const existingSchedulesCollection = collection(db, 'schedules');
      const existingSchedulesQuery = await getDocs(
        query(
          existingSchedulesCollection,
          where('Roomno', '==', roomNo),
          where('End', '>', new Date(`${date} ${startTime}`)),
        )
      );
  
      const conflictingSchedules = existingSchedulesQuery.docs
        .map((doc) => doc.data())
        .filter((schedule) => {
          const scheduleStart = schedule.Start.toDate().getTime();
          const scheduleEnd = schedule.End.toDate().getTime();
          const checkStartTime = new Date(`${date} ${startTime}`).getTime();
          const checkEndTime = new Date(`${date} ${endTime}`).getTime();
  
          // Check for conflicts with the current schedule
          return (
            (checkStartTime >= scheduleStart && checkStartTime < scheduleEnd) ||
            (checkEndTime > scheduleStart && checkEndTime <= scheduleEnd) ||
            (checkStartTime <= scheduleStart && checkEndTime >= scheduleEnd)
          );
        });
  
      if (conflictingSchedules.length > 0) {
        // If there are existing schedules in the specified time range, display an alert
        alert('Schedule conflict! Please choose a different time or room.');
        return;
      }
  
      // If no conflicts, proceed to add the new schedule
      const docRef = await addDoc(collection(db, 'schedules'), {
        Title: newEvent.title,
        Roomno: roomNo,
        Start: new Date(`${date} ${startTime}`),
        End: new Date(`${date} ${endTime}`),
        Professor: newEvent.professor,
      });
  
      onEventAdded({
        id: docRef.id,
        Title: newEvent.title,
        Roomno: roomNo,
        Start: new Date(`${date} ${startTime}`),
        End: new Date(`${date} ${endTime}`),
        Professor: newEvent.professor,
      });
  
      onClose();
  
      setNewEvent({
        title: '',
        roomNo: '',
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

        <div className="group">
          <label htmlFor="roomNo">Room Number:</label>
          <select
            name="roomNo"
            value={newEvent.roomNo}
            onChange={handleChange}
            required
          >
            <option value="">Select a Room</option>
            {rooms.map((room) => (
              <option key={room.Roomno} value={room.Roomno}>
                {room.Roomno}
              </option>
            ))}
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
