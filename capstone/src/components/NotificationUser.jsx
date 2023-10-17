import React from 'react';
// NotificationUser.js
import { useNotificationContext } from './NotificationContext';

function NotificationUser({ onClose }) {
  const { requestAccepted } = useNotificationContext();

  return (
    <div className='notification-form'>
      <div className='notification-header'>
        <h2>Notification</h2>
        <button className='close-button' onClick={onClose}>
          &times;
        </button>
      </div>
      <div className='notification-content'>
        {requestAccepted ? (
          <div className='accepted-message'>
            <p>Your request has been approved by the admin.</p>
            {/* Display other details of the accepted request if needed */}
          </div>
        ) : (
          <p>No new notifications</p>
        )}
      </div>
    </div>
  );
}


export default NotificationUser;
