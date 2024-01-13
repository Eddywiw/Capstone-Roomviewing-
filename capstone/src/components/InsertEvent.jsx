import React, { useState, useEffect } from 'react';
import './InsertEvent.css';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firestore';

// CustomRepeatModal component
function CustomRepeatModal({ isOpen, onClose, onChange }) {
  if (!isOpen) return null;

  return (
    <div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="customRepeatEndDate"
          onChange={onChange}
          required
        />
      </div>
      <div className="groupko">
        <label>Repeat on weekdays:</label>
        <div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                name={day}
                onChange={onChange}
              />
              {day}
            </label>
          ))}
        </div>
      </div>
      <button onClick={onClose}>Close Modal</button>
    </div>
  );
}

function InsertEvent() {
  const handleCustomRepeatChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === 'customRepeatEndDate') {
      setCustomRepeatEndDate(value);
    } else {
      setSelectedWeekdays({
        ...selectedWeekdays,
        [name]: checked,
      });
    }
  };

  const handleCustomRepeatSubmit = () => {
    setCustomRepeatModalOpen(false);
  };
  const [repeatOption, setRepeatOption] = useState('Just Once');
  const [selectedSection, setSelectedSection] = useState('bsit');
  const [newEvent, setNewEvent] = useState({
    title: '',
    roomNo: '',
    section: '',
    date: '',
    startTime: '',
    endTime: '',
    professor: '',
  });

  const [selectedWeekdays, setSelectedWeekdays] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  const [customRepeatModalOpen, setCustomRepeatModalOpen] = useState(false);
  const [customRepeatEndDate, setCustomRepeatEndDate] = useState('');

  const [professors, setProfessors] = useState([]);

  useEffect(() => {
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
  }, []);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
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
  }, []);

  const [sections, setSections] = useState([]);

  useEffect(() => {
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
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      const professor = professors.find((prof) => prof.teacherName === value);
      setNewEvent({
        ...newEvent,
        title: professor.teacherName,
        professor: professor.subjectName,
      });
    } else if (name === 'roomNo') {
      setNewEvent({ ...newEvent, [name]: value });
    } else if (name === 'repeatOption') {
      setRepeatOption(value);
      if (value === 'Custom') {
        setCustomRepeatModalOpen(true);
      } else {
        setCustomRepeatModalOpen(false);
      }
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { roomNo, date, startTime, endTime, section } = newEvent;
  
      if (repeatOption === 'Custom') {
        // For custom repeat, create schedules for selected weekdays until the end date
        const selectedDays = Object.keys(selectedWeekdays).filter(day => selectedWeekdays[day]);
  
        const endDateTime = new Date(`${customRepeatEndDate} ${endTime}`);
        let currentDateTime = new Date(`${date} ${startTime}`);
  
        while (currentDateTime < new Date(endDateTime.getFullYear(), endDateTime.getMonth(), endDateTime.getDate() + 1)) {
          console.log('Checking for conflicts at', currentDateTime);
  
          // Add the new schedule without checking conflicts
          await addDoc(collection(db, 'schedules'), {
            Title: newEvent.title,
            Roomno: roomNo,
            Section: section,
            Start: new Date(currentDateTime),
            End: new Date(new Date(currentDateTime).setHours(endTime.split(':')[0], endTime.split(':')[1])),
            Professor: newEvent.professor,
          });
  
          // Move to the next occurrence
          currentDateTime.setDate(currentDateTime.getDate() + 1);
          while (!selectedDays.includes(currentDateTime.toLocaleString('en-US', { weekday: 'short' }))) {
            // Move to the next day until a selected weekday is found
            currentDateTime.setDate(currentDateTime.getDate() + 1);
          }
        }
      } else if (repeatOption === 'Just Once') {
        // Add the schedule for a single occurrence
        await addDoc(collection(db, 'schedules'), {
          Title: newEvent.title,
          Roomno: roomNo,
          Section: section,
          Start: new Date(`${date} ${startTime}`),
          End: new Date(`${date} ${endTime}`),
          Professor: newEvent.professor,
        });
      }  else {
        // Handle other repeat options (e.g., 'Just Once')
        // ... (existing code for other repeat options)
      }
  
      // Display alert when the room is successfully added
      window.alert('Room successfully added!');
  
      // Reset form fields
      setNewEvent({
        title: '',
        roomNo: '',
        section: '',
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
          <label htmlFor="section">Section:</label>
          <select
            name="section"
            value={newEvent.section}
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

        <div className="group">
          <label htmlFor="repeatOption">Repeat:</label>
          <select
            name="repeatOption"
            value={repeatOption}
            onChange={handleChange}
            required

          > 
            <option value="Just Once">Just Once</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <CustomRepeatModal
          isOpen={customRepeatModalOpen}
          onClose={() => setCustomRepeatModalOpen(false)}
          onChange={handleCustomRepeatChange}
        />





        <div>
          <button type="submit" className="submitbtn">
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default InsertEvent;
