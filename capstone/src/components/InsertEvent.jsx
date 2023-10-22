import React, { useState } from 'react';
import './InsertEvent.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firestore';

function InsertEvent({onClose,onEventAdded}) {

  const [newEvent, setNewEvent] = useState({
    title: "",
    date:"",
    startTime: "",
    endTime: "",
    professor: ""
});
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

 const handleSubmit = async (event) => {
  event.preventDefault();
  try {


    // Create a new document in the "schedules" collection with the user's ID
    const docRef = await addDoc(collection(db, "schedules"), {
      
      Title: newEvent.title,
      Start: new Date(`${newEvent.date} ${newEvent.startTime}`),
      End: new Date(`${newEvent.date} ${newEvent.endTime}`),
      Professor: newEvent.professor,
    });

    // Call the onEventAdded callback with the new event data
    onEventAdded({
      id: docRef.id, // Include the userId in the event data
      Title: newEvent.title,
      Start: new Date(`${newEvent.date} ${newEvent.startTime}`),
      End: new Date(`${newEvent.date} ${newEvent.endTime}`),
      Professor: newEvent.professor,
    });

    console.log("Document written with ID: ", docRef.id);

    // Close the CreateUser modal after successful addition
    onClose();

    // Clear the form inputs after successful addition
    setNewEvent({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      professor: "",
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};


  return (
    <div>
      <form className='formcon' onSubmit={handleSubmit}>
       
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="title"
            value={newEvent.title}
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
              id="startTime" // Add this id
              value={newEvent.startTime}
              onChange={handleChange}
              required
            />         
        </div>
        <div className='group'>
          <label htmlFor="endTime">End Time:</label>
              <input
                placeholder=""
                type="time"
                name="endTime"
                id="endTime" // Add this id
                value={newEvent.endTime}
                onChange={handleChange}
                required
              />
        </div>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="professor"
            value={newEvent.professor}
            onChange={handleChange}
            required
          />
          <label htmlFor="professor">Professor:</label>
        </div>
        <div>
          <button type="submit">Add Event</button>
        </div>
      </form>
    </div>
  );
}

export default InsertEvent;
