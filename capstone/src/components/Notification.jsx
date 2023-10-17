import React, { useEffect, useState } from 'react';
import './Notification.css';
import { db } from '../config/firestore';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { useNotificationContext } from './NotificationContext';
function NotificationForm({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'notifications'));
      const notificationData = querySnapshot.docs.map((doc) => ({
        id: doc.id,  // Use the document ID as the identifier
        ...doc.data(),
      }));
      setNotifications(notificationData);
    };
  
    fetchData();
  }, []);
  const { setRequestAccepted } = useNotificationContext();
  const handleDeleteBtnClick = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      // After successfully deleting the notification, update the state to remove it from the list
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  
  const handleAcceptBtnClick = async (notificationId) => {
    try {
      // 1. Delete the notification from the 'notifications' collection
      await deleteDoc(doc(db, 'notifications', notificationId));

      // 2. Add the accepted notification to the 'accept' collection
      const acceptedNotification = notifications.find(notification => notification.id === notificationId);
      if (acceptedNotification) {
        await addDoc(collection(db, 'accept'), acceptedNotification);
      }

      // 3. Remove the notification from the state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
      setRequestAccepted(true);
      // 4. Send a message to NotificationUser component
      // You can pass the acceptedNotification data as a prop to NotificationUser
      // and update the NotificationUser component to display the message.
    } catch (error) {
      console.error("Error accepting document: ", error);
    }
  };
  

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
              <button className='acceptBtn' onClick={() => handleAcceptBtnClick(notification.id)}>Accept</button>
              <button
                className='declineBtn'
                onClick={() => handleDeleteBtnClick(notification.id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationForm;
