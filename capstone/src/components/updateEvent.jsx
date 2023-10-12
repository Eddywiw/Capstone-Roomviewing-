import React, { useState } from 'react';
import './InsertEvent.css';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';

function UpdateEvent({ onClose, currentEvent, timedateformat, getEvent }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({
    title: currentEvent.Title,
    date: timedateformat(currentEvent.Start).date,
    startTime: timedateformat(currentEvent.Start).time,
    endTime: timedateformat(currentEvent.End).time,
    professor: currentEvent.Professor
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedEvent({ ...updatedEvent, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      // Convert date and time back to a Firestore-compatible format
      const startTimestamp = new Date(`${updatedEvent.date} ${updatedEvent.startTime}`);
      const endTimestamp = new Date(`${updatedEvent.date} ${updatedEvent.endTime}`);

      // Update the event in Firestore
      const studentRef = doc(db, 'schedules', currentEvent.id);
      await updateDoc(studentRef, {
        Title: updatedEvent.title,
        Start: startTimestamp,
        End: endTimestamp,
        Professor: updatedEvent.professor,
      });

      // Close the update form after successful update
      onClose();

      // Clear the form inputs after successful update
      setUpdatedEvent({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        professor: ''
      });

      // Refresh the event list
      getEvent();
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    setIsUpdating(false);
  };

  return (
    <div >
       <button className="exit-btn" onClick={onClose}>
          X
        </button>
       
      <form className='formcon' onSubmit={handleSubmit}>
       
        <div className="group">
            <input
                placeholder=""
                type="text"
                name="title"
                value={updatedEvent.title}
                onChange={handleChange}
                required
            />
            <label htmlFor="title">Subject:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="date"
            name="date"
            value={updatedEvent.date}
            onChange={handleChange}
            required
          />
          <label htmlFor="date">Date:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="time"
            name="startTime"
            value={updatedEvent.startTime}
            onChange={handleChange}
            required
          />
          <label htmlFor="startTime">Start Time:</label>
          <input
            placeholder=""
            type="time"
            name="endTime"
            value={updatedEvent.endTime}
            onChange={handleChange}
            required
          />
          <label htmlFor="endTime">End Time:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="professor"
            value={updatedEvent.professor}
            onChange={handleChange}
            required
          />
          <label htmlFor="professor">Professor:</label>
        </div>
        <div>
          <button className="updatestubtn" type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEvent;
                                