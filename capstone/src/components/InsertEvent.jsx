import React, { useState, useEffect } from 'react';
import './InsertEvent.css';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firestore';

function InsertEvent() {
  const [selectedSection, setSelectedSection] = useState('bsit');
  const [newEvent, setNewEvent] = useState({
    title: '',
    roomNo: '',
    section: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    professor: '',
  });
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const handleDayChange = (day) => {
    setDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const [professors, setProfessors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sections, setSections] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const professorCollection = collection(db, 'teacher_subject');
        const professorSnapshot = await getDocs(professorCollection);
        const professorData = [];
        professorSnapshot.forEach((doc) => {
          const professor = doc.data();
          professorData.push(professor);
        });
        setProfessors(professorData);

        const roomsCollection = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomData = [];
        roomsSnapshot.forEach((doc) => {
          const room = doc.data();
          roomData.push(room);
        });
        setRooms(roomData);

        const sectionsCollection = collection(db, 'section');
        const sectionsSnapshot = await getDocs(sectionsCollection);
        const sectionData = [];
        sectionsSnapshot.forEach((doc) => {
          const section = doc.data();
          sectionData.push(section);
        });
        setSections(sectionData);

        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
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
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const {
        roomNo,
        startDate,
        endDate,
        startTime,
        endTime,
        section,
      } = newEvent;
  
      const existingSchedulesCollection = collection(db, 'schedules');
      const conflictingSchedules = [];
  
      const startDateTime = new Date(`${startDate} ${startTime}`);
      const endDateTime = new Date(`${endDate} ${endTime}`);
  
      let currentDate = new Date(startDateTime);
  
      while (currentDate <= endDateTime) {
        // Check if the current day is selected
        const dayOfWeek = currentDate
          .toLocaleDateString('en-US', { weekday: 'short' })
          .toLowerCase();
  
        if (days[dayOfWeek]) {
          const existingSchedulesQuery = await getDocs(
            query(
              existingSchedulesCollection,
              where('Roomno', '==', roomNo),
              where('End', '>', currentDate)
            )
          );
  
          conflictingSchedules.push(
            ...existingSchedulesQuery.docs
              .map((doc) => doc.data())
              .filter((schedule) => {
                const scheduleStart = schedule.Start.toDate().getTime();
                const scheduleEnd = schedule.End.toDate().getTime();
  
                return (
                  (startDateTime >= scheduleStart && startDateTime < scheduleEnd) ||
                  (endDateTime > scheduleStart && endDateTime <= scheduleEnd) ||
                  (startDateTime <= scheduleStart && endDateTime >= scheduleEnd)
                );
              })
          );
        }
  
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
  
      if (conflictingSchedules.length > 0) {
        alert(
          'Schedule conflict! Please choose a different time or room.'
        );
        return;
      }
  
      // Add the event only on selected days
      currentDate = new Date(startDateTime); // Reset currentDate to startDateTime
  
      for (const day in days) {
        if (days[day]) {
          await addDoc(
            collection(db, 'schedules'),
            {
              Title: newEvent.title,
              Roomno: roomNo,
              Section: section,
              Start: new Date(
                `${currentDate.toISOString().split('T')[0]} ${startTime}`
              ),
              End: new Date(
                `${currentDate.toISOString().split('T')[0]} ${endTime}`
              ),
              Professor: newEvent.professor,
              Day: day,
            }
          );
        }
  
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
  
      window.alert('Room successfully added!');
  
      setNewEvent({
        title: '',
        roomNo: '',
        section: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        professor: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  // Function to format date and time for display
  const formatDateTime = (date, time) => {
    const dateTimeString = `${date} ${time}`;
    const dateObject = new Date(dateTimeString);
    const formattedDateTime = dateObject.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Manila', // Adjust the timezone as needed
    });

    return formattedDateTime;
  };

  if (!dataLoaded) {
    return <div>Loading...</div>; // or any other loading indicator
  }

  return (
    <div>
      <form className="formcon" onSubmit={handleSubmit}>
        <div className="group">
          <label htmlFor="professor">Professor & Subject:</label>
          <select name="title" value={newEvent.title} onChange={handleChange} required>
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
          <select name="roomNo" value={newEvent.roomNo} onChange={handleChange} required>
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
          <select name="section" value={newEvent.section} onChange={handleChange} required>
            <option value="">Select Section</option>
            <option value="BSIT-11-A">BSIT 11-A</option>
            <option value="BSIT-21-A">BSIT 21-A</option>
            <option value="BSIT-31-A">BSIT 31-A</option>
            <option value="BSIT-41-A">BSIT 41-A</option>
            <option value="BSBA-11-A">BSBA 11-A</option>
            <option value="BSBA-21-A">BSBA 21-A</option>
            <option value="BSBA-31-A">BSBA 31-A</option>
            <option value="BSBA-41-A">BSBA 41-A</option>
            <option value="HRS-11-A">HRS 11-A</option>
            <option value="HRS-21-A">HRS 21-A</option>
            <option value="GAS-11">GAS 11</option>
            <option value="GAS-12">GAS 12</option>
            <option value="MAWD-11">MAWD 11</option>
            <option value="MAWD-12">MAWD 12</option>
            <option value="CULART-11">CULART 11</option>
            <option value="CULART-12">CULART 12</option>
            <option value="ABM-11">ABM 11</option>
            <option value="ABM-12">ABM 12</option>
          </select>
        </div>

        <div className="group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            placeholder=""
            type="date"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="group">
          <label htmlFor="endDate">End Date:</label>
          <input
            placeholder=""
            type="date"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleChange}
            required
          />
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

        {/* Display formatted start and end times */}
        <div className="group">
          <label htmlFor="formattedStartTime">Formatted Start Time:</label>
          <span>{formatDateTime(newEvent.startDate, newEvent.startTime)}</span>
        </div>
        <div className="group">
          <label htmlFor="formattedEndTime">Formatted End Time:</label>
          <span>{formatDateTime(newEvent.endDate, newEvent.endTime)}</span>
        </div>

        <div className="groupko">
          <label htmlFor="repeatDays">Repeats on:</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="monday"
                checked={days.monday}
                onChange={() => handleDayChange('monday')}
              />
              <span className="custom-checkbox">M</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="tuesday"
                checked={days.tuesday}
                onChange={() => handleDayChange('tuesday')}
              />
              <span className="custom-checkbox">T</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="wednesday"
                checked={days.wednesday}
                onChange={() => handleDayChange('wednesday')}
              />
              <span className="custom-checkbox">W</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="thursday"
                checked={days.thursday}
                onChange={() => handleDayChange('thursday')}
              />
              <span className="custom-checkbox">Th</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="friday"
                checked={days.friday}
                onChange={() => handleDayChange('friday')}
              />
              <span className="custom-checkbox">F</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="saturday"
                checked={days.saturday}
                onChange={() => handleDayChange('saturday')}
              />
              <span className="custom-checkbox">Sa</span>
            </label>
          </div>
        </div>

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
