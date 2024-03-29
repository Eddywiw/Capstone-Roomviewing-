import React, { useState, useEffect } from 'react';
import { db } from '../config/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { doc, deleteDoc, addDoc } from 'firebase/firestore';
import './scheduleTBL.css';
import InsertEvent from './InsertEvent';
import UpdateEvent from './updateEvent';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScheduleTBL() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showUpdateEvent, setShowUpdateEvent] = useState(false);
  const [eventList, setEventList] = useState([]);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventList(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteBtnClick = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Event?');
  
    if (confirmDelete) {
      try {
        // Retrieve the event details before deleting it
        const eventToDelete = eventList.find((event) => event.id === eventId);
  
        // Delete the document from the 'schedules' collection
        await deleteDoc(doc(db, 'schedules', eventId));
  
        // Update the local state to remove the deleted event
        setEventList((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  
        // Insert the deleted event into the 'ScheduleArchives' collection
        const archivesRef = collection(db, 'ScheduleArchives');
        await insertEventIntoArchives(archivesRef, eventToDelete);
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };
  
  // Function to insert the event into the 'ScheduleArchives' collection
  const insertEventIntoArchives = async (archivesRef, event) => {
    try {
      // Add the event to the 'ScheduleArchives' collection
      const newEventRef = await addDoc(archivesRef, event);
      console.log('Event added to ScheduleArchives with ID: ', newEventRef.id);
    } catch (error) {
      console.error('Error adding document to ScheduleArchives: ', error);
    }
  };
  

  const handleUpdateBtnClick = (event) => {
    setCurrentEvent(event);
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
      <div className='Event-table-container'>
        <div className='lbl-eventlist-con'>
          <p className='lbl-eventlist'>Events List:</p>
        </div>
        <Table striped bordered hover>
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
                <td>
                  {event.Day} | {`${formatFirestoreTimestamp(event.Start).date} - ${formatFirestoreTimestamp(event.End).date}`}
                </td>
                <td>{`${formatFirestoreTimestamp(event.Start).time} - ${formatFirestoreTimestamp(event.End).time}`}</td>
                <td>{event.Title}</td>
                <td>{event.Professor}</td>
                <td>
                <div className='d-flex justify-content-center'>
                  <Button variant='outline-primary' className='mr-3' onClick={() => handleUpdateBtnClick(event)}>
                    Edit
                  </Button>
                  <Button variant='outline-danger' onClick={() => handleDeleteBtnClick(event.id)}>
                    Remove
                  </Button>
                </div>

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {showUpdateEvent && currentEvent && (
        <div className='form-container'>
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
