import React from 'react'
import ScheduleTBL from '../components/scheduleTBL';
import './AdminHome.css'
function AdminHome() {
  return (
    <div className='mainadhome-con'>
      <div className='bgcolor'>
       
        <div className='lbl_dashboard'>
          <p>My Dashboard</p>
        </div>
        <div className='tota-con'>
        
          <div className='totalstudents'>
              <p>0</p>
              <p>Total Students</p>
          </div>
         
      

          <div className='totalprof'>
              <p>0</p>
              <p>Total Professors</p>
          </div>
        </div>
        
          <div className="schedule-con">
            <ScheduleTBL/>
          </div>
      </div>
      
      
    </div>
  )
}

export default AdminHome