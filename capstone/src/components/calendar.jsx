import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import InsertEvent from './InsertEvent';
import moment from 'moment';
import { db } from '../config/firestore';
import { collection, getDocs } from 'firebase/firestore';
import './Calendar.css';

const localizer = momentLocalizer(moment);

function Calendar() {
  const [eventList, setEventList] = useState([]);


  const fetchEvents = async () => {
    try {
      
      const eventsCollection = collection(db, 'schedules');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.userId,
        title: doc.data().Title,
        start: doc.data().Start.toDate(), // Convert Timestamp to Date
        end: doc.data().End.toDate(), // Convert Timestamp to Date
      }));
      setEventList(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component mounts or when eventList changes
  }, [eventList]);



  return (
    <div className="modern-calendar-container">
      
      <BigCalendar className='calen'  
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        
      />
    </div>
  );
}

export default Calendar;