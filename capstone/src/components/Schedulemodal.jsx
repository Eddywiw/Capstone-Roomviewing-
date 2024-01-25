// Schedulemodal.jsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';

import './Schedulemodal.css'; // Import your CSS file for styling

function Schedulemodal({ onClose, onSelectSchedule, currentUser }) {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schedules'));
        const scheduleList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSchedules(scheduleList);
      } catch (error) {
        console.error('Error fetching schedules: ', error);
      }
    };

    fetchSchedules();
  }, []);

  // Use a set to keep track of unique combinations of "Title" and "Professor"
  const uniqueCombinationsSet = new Set();

  const uniqueSchedules = schedules.filter((schedule) => {
    const combination = `${schedule.Title} - ${schedule.Professor}`;
    if (!uniqueCombinationsSet.has(combination)) {
      uniqueCombinationsSet.add(combination);
      return true;
    }
    return false;
  });

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleConfirm = () => {
    if (selectedSchedule && selectedSchedule.id) {
      onSelectSchedule(selectedSchedule);
      onClose();
    } else {
      console.error('Invalid selectedSchedule:', selectedSchedule);
    }
  };

  return (
    <div className="schedule-modal-container">
      <div className="schedule-modal">
        <h2>Select a Schedule</h2>
        <ul className="schedule-list">
          {uniqueSchedules.map((schedule) => (
            <li
              key={schedule.id}
              onClick={() => handleSelectSchedule(schedule)}
              className={selectedSchedule === schedule ? 'selected' : ''}
            >
              {schedule.Title} - {schedule.Professor}
            </li>
          ))}
        </ul>
        <div className="button-container">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm} disabled={!selectedSchedule}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Schedulemodal;
