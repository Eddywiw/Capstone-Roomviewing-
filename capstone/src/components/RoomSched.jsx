import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../config/firestore";
import './RoomSched.css';

function RoomSched({ onclose, currentRoomNumber }) {
  const [schedules, setSchedules] = useState([]);

  const getRoomsked = async () => {
    try {
      console.log('Fetching schedules for room number:', currentRoomNumber);
      const roomNumber = currentRoomNumber;
      const schedulesQuery = query(
        collection(db, "schedules"),
        where("Roomno", "==", roomNumber)
      );
      const querySnapshot = await getDocs(schedulesQuery);
      const schedule = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSchedules(schedule);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getRoomsked();
  }, [currentRoomNumber]);

  return (
    <div className='form-div'>
      <button onClick={onclose} className='exit-btn'>
        X
      </button>
      <ul className='schedule-list'>
        {schedules.map((schedule) => (
          <li key={schedule.id} className='schedule-item'>
            <div>
              <strong>{schedule.Title}</strong> - {schedule.Professor}
            </div>
            <div>
              Date: {schedule.Start.toDate().toLocaleDateString()} | 
              Start: {schedule.Start.toDate().toLocaleTimeString()} - 
              End: {schedule.End.toDate().toLocaleTimeString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomSched;
