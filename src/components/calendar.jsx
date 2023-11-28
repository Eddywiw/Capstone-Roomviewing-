import React, { useState, useEffect, useRef } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import InsertEvent from './InsertEvent';
import moment from 'moment';
import { db } from '../config/firestore';
import { collection, getDocs } from 'firebase/firestore';
import './Calendar.css';
import EventEditModal from './EventEditModal';

const localizer = momentLocalizer(moment);

function Calendar() {
  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventModalRef = useRef();

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'schedules');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().Title,
        start: doc.data().Start.toDate(),
        end: doc.data().End.toDate(),
        professor: doc.data().Professor
      }));
      setEventList(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [eventList]);

  const handleEventClick = (event, e) => {
    setSelectedEvent(event);
    eventModalRef.current.style.display = 'block';
  };

  const handleModalClose = () => {
    eventModalRef.current.style.display = 'none';
  };

  const handleEventUpdate = (updatedEvent) => {
    fetchEvents();
    handleModalClose();
  };

  return (
    <div className="calendar-con">
      <div className="modern-calendar-container">
        <BigCalendar
          localizer={localizer}
          events={eventList.map((event) => ({
            id: event.id,
            title: `${event.title} - ${event.professor}`,
            start: event.start,
            end: event.end,
          }))}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
        />
      </div>
      <div className="event-modal" ref={eventModalRef}>
        {selectedEvent && (
          <EventEditModal event={selectedEvent} onClose={handleModalClose} onUpdate={handleEventUpdate} />
        )}
      </div>
    </div>
  );
}

export default Calendar;
