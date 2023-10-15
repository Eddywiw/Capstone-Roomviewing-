import React, { useEffect, useState } from 'react';
import './Notification.css';
import { db } from '../config/firestore';
import { collection, getDocs } from 'firebase/firestore';

function NotificationForm({ onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'notifications'));
      const notificationData = querySnapshot.docs.map((doc) => doc.data());
      setNotifications(notificationData);
    };

    fetchData();
  }, []);

  return (
    <div className='notification-form'>
      <div className='notification-header'>
        <h2>Notification</h2>
        <button className='close-button' onClick={onClose}>
          &times;
        </button>
      </div>
      <div className='notification-content'>
        {notifications.map((notification, index) => (
          <div key={index} className='notification-item'>
            {/* Display notification content, e.g., room booking requests */}
            <p>Teacher: {notification.teacherName}</p>
            <p>Requested room: {notification.roomNumber}</p>
            <p>Date: {notification.date}</p>
            <p>Time: {notification.time}</p>
            <p>For the Reason: {notification.reason}</p>
            <div className='acceptbtn-con'>
              <button className='acceptBtn'>Accept</button>
              <button className='declineBtn'>Decline</button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationForm;
