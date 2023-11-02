import React, { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../config/firestore";

const EventList = () => {
    const [events, setEventList] = useState([]);
 
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

  // ... Filtering and displaying current and upcoming events (as previously shown) ...
  const currentDate = new Date();

  const currentEvents = events.filter((event) => {
    const eventEndDate = new Date(event.End.toDate());
    return eventEndDate > currentDate;
  });
  
  const upcomingEvents = events.filter((event) => {
    const eventStartDate = new Date(event.Start.toDate());
    return eventStartDate > currentDate;
  });
  
  return (
    <div>
      <h2>Current Events</h2>
      <ul>
        {currentEvents.map((event) => (
          <li key={event.id}>
            {event.Title} - {event.Professor}
          </li>
        ))}
      </ul>
  
      <h2>Upcoming Events</h2>
      <ul>
        {upcomingEvents.map((event) => (
          <li key={event.id}>
            {event.Title} - {event.Professor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
