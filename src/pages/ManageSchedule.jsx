import React from 'react';
import './ManageSchedule.css';
import AdminCalendar from '../components/adminCalendar';
import Calendar from '../components/calendar';
import InsertEvent from '../components/InsertEvent';


function ManageSchedule() {
  return (
    <div className="mngschedule-container">
      <div className='mng-con'>
      <InsertEvent/>
      <Calendar/>
      </div>
      
    </div>
  );
}

export default ManageSchedule;
