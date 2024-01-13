import React, { useEffect, useState } from 'react';
import './Notification.css';
import { db } from '../config/firestore';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import { useNotificationContext } from './NotificationContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
function Pending() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'admin_notification'));
        const notificationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationData);
      } catch (error) {
        console.error('Error fetching notifications: ', error);
      }
    };

    fetchData();
  }, []);

  const { setRequestAccepted } = useNotificationContext();

  const handleDeleteBtnClick = async (notificationId) => {
    try {
      // 1. Delete the notification from the 'notifications' collection
      await deleteDoc(doc(db, 'admin_notification', notificationId));

      // 2. Add the accepted notification to the 'accept' collection
      const acceptedNotification = notifications.find(
        (notification) => notification.id === notificationId
      );
      if (acceptedNotification) {
        await addDoc(collection(db, 'decline'), acceptedNotification);
      }

      // 3. Remove the notification from the state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
      setRequestAccepted(true);
    } catch (error) {
      console.error('Error accepting document: ', error);
    }
  };

  const handleAcceptBtnClick = async (notificationId) => {
    try {
      // 1. Delete the notification from the 'notifications' collection
      await deleteDoc(doc(db, 'admin_notification', notificationId));

      // 2. Add the accepted notification to the 'accept' collection
      const acceptedNotification = notifications.find(
        (notification) => notification.id === notificationId
      );
      if (acceptedNotification) {
        await addDoc(collection(db, 'accept'), acceptedNotification);
      }

      // 3. Remove the notification from the state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
      setRequestAccepted(true);
    } catch (error) {
      console.error('Error accepting document: ', error);
    }
  };

  return (
    <div className="container mt-4">
      <ul className="list-group">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <li key={index} className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{notification.reason}</h5>   
              <small> {notification.date} | {notification.time}</small>
            </div>  
              <p className="mb-1">
              Room: {notification.roomNumber} | Teacher: {notification.teacherName}
              </p>
              <div className='acceptbtn-con'>
                <button
                  className='acceptBtn'
                  onClick={() => handleAcceptBtnClick(notification.id)}
                >
                  Accept
                </button>
                <button
                  className='declineBtn'
                  onClick={() => handleDeleteBtnClick(notification.id)}
                >
                  Decline
                </button>
              </div>
         

            </li>
          ))
        )}

      </ul>
    </div>
  );
}

export default Pending;
