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
          <div key={index}>
            {/* Display notification content, e.g., room booking requests */}
            <p>
              Teacher: {notification.teacherName} requested room {notification.roomNumber} on{' '}
              {notification.date} at {notification.time} for the reason: {notification.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationForm;
