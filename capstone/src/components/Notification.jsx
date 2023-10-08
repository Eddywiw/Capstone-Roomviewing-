import React from 'react';
import './Notification.css';

function NotificationForm({ onClose }) {
  return (
    <div className="notification-form">
      <div className="notification-header">
        <h2>Notification</h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="notification-content">
        {/* Your notification content goes here */}
        <p>This is a sample notification message.</p>
      </div>
    </div>
  );
}

export default NotificationForm;
