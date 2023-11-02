import React from 'react';
import './Schedule.css';
import Kalendar from '../components/calendar';
import EventList from '../components/EventList';

function Schedule() {
  return (
    <div className="schedule-container">
      <EventList/>   
    </div>
  );
}

export default Schedule;
