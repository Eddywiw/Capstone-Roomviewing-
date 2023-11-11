import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../config/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EventList.css";

const EventList = () => {
  const [events, setEventList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const [noScheduleMessage, setNoScheduleMessage] = useState(""); // Message when there are no schedules

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchEvents = async (selectedDate) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const eventsData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(event => {
          const eventDate = event.Start.toDate();
          return eventDate.getDate() === selectedDate.getDate() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getFullYear() === selectedDate.getFullYear();
        });

      if (eventsData.length === 0) {
        setNoScheduleMessage("There is no schedule for this day.");
      } else {
        setNoScheduleMessage("");
      }

      setEventList(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  return (
    <div className="eventlist-main">
      <div className="datepicker-div">
        <h2>Select a Date</h2>
        <DatePicker selected={selectedDate} onChange={handleDateChange} inline />
      </div>
      
      <div className="list-div">
        <h2 className="lbl-h2sched">Schedule For {selectedDate.toLocaleDateString()}</h2>
        {noScheduleMessage ? (
          <p>{noScheduleMessage}</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {event.Title} - {event.Professor} <br /> Date: {event.Start.toDate().toLocaleDateString()} | Start: {event.Start.toDate().toLocaleTimeString()} - End: {event.End.toDate().toLocaleTimeString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventList;
