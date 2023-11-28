import React, { useEffect, useState } from 'react';

function NotificationUser({ requestAccepted }) {
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // Set the notification message based on whether the request is accepted
    if (requestAccepted) {
      setNotificationMessage('Your booking request has been accepted!');
    } else {
      setNotificationMessage('Your booking request has been declined.');
    }

    // Reset the notification message after a delay (e.g., 5 seconds)
    const timeoutId = setTimeout(() => {
      setNotificationMessage('');
    }, 5000);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [requestAccepted]);

  return (
    <div className='notification-user'>
      {notificationMessage && (
        <div className='notification-message'>{notificationMessage}</div>
      )}
    </div>
  );
}

export default NotificationUser;
