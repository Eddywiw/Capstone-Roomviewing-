import React, { useState, useEffect } from 'react';
import { db } from '../config/firestore';
import { collection, getDocs } from 'firebase/firestore';
import './Users.css'
import InsertEvent from './InsertEvent';
import { doc, deleteDoc } from "firebase/firestore";
import UpdateEvent from './updateEvent';
function ScheduleTBL() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showUpdateEvent, setShowUpdateEvent] = useState(false); // State to control the modal
  const [eventList, setEventList] = useState([]);
 
  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEventList(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    setShowInsertForm(true);
  };


  const handleDeleteBtnClick = async (userId) => {
    try {
      await deleteDoc(doc(db, "schedules", userId));
      // After successfully deleting the document, update the state to remove the deleted user from the table
      setEventList((prevEvents) => prevEvents.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleUpdateBtnClick = (event) => {
    setCurrentEvent(event); // Pass the entire event object
    setShowUpdateEvent(true);
  };
  
  
  const handleCloseUpdate = () => {
    setShowUpdateEvent(false);
  };
  function formatFirestoreTimestamp(timestamp) {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      const formattedDate = date.toLocaleDateString('en-US');
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return { date: formattedDate, time: formattedTime };
    }

    return { date: '', time: '' };
  }

  return (
    <div className='use-div'>
      <div className='table-container'>
          <div>
            <p>Events List:</p>
          </div>
        <table className='table'>
          
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Professor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {eventList.map((event, index) => (
              <tr key={index}>
                <td>{formatFirestoreTimestamp(event.Start).date}</td>
                <td>{`${formatFirestoreTimestamp(event.Start).time} - ${formatFirestoreTimestamp(event.End).time}`}</td>
                <td>{event.Title}</td>
                <td>{event.Professor}</td>
                <td>
                  <div className='button-div'>
                    <button onClick={() => handleUpdateBtnClick(event)} className='editbtn'>Edit</button>
                    <button onClick={() => handleDeleteBtnClick(event.id)} className='deletebtn'>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showUpdateEvent && currentEvent && (
          <div className="form-container">
            <UpdateEvent
              onClose={handleCloseUpdate}
              currentEvent={currentEvent}
              getEvent={fetchEvents}
              timedateformat={formatFirestoreTimestamp}
            />
          </div>
        )}


    </div>
  );
}

export default ScheduleTBL;
