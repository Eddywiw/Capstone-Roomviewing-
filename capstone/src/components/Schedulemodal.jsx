import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';

import './Schedulemodal.css'; // Import your CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

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

  const handleConfirm = async () => {
    if (selectedSchedule && selectedSchedule.id) {
      try {
        const querySnapshot = await getDocs(collection(db, 'irregularSchedule'));
        const existingSchedules = querySnapshot.docs.map(doc => doc.data());
  
        // Check if any schedule with the same Title exists for the selected user
        const isScheduleExisting = existingSchedules.some(schedule => {
          return (
            schedule.userName === currentUser.Name && // Assuming currentUser has a Name property
            schedule.Title === selectedSchedule.Title
          );
        });
  
        if (isScheduleExisting) {
          alert('A schedule with the same title already exists for the selected user.');
        } else {
          alert('A schedule is added successfully.');
          onSelectSchedule(selectedSchedule);
          onClose();
        }
      } catch (error) {
        console.error('Error checking existing schedules: ', error);
      }
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
              className={`list-group-item ${selectedSchedule === schedule ? 'active' : ''}`}
            >
              {schedule.Title} - {schedule.Professor}
            </li>
          ))}
        </ul>
        <div className="button-container">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={!selectedSchedule}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Schedulemodal;
