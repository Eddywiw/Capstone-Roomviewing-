import React, { useEffect, useState } from 'react';
import './Notification.css';
import { db } from '../config/firestore';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import { useNotificationContext } from './NotificationContext';
import NotificationUser from './NotificationUser'; // Import NotificationUser component

function NotificationForm({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const handleview = () => {
    onClose(); // Close the NotificationForm
    navigate('/pendingnotif');
  }
  
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
    <div className='notification-form'>
      <div className='notification-header'>
        <h2>Notification</h2>
        <button className='close-button' onClick={onClose}>
          &times;
        </button>
      </div>
      <div className='notification-content'>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className='notification-item'>
              <p>Teacher: {notification.teacherName}</p>
              <p>Requested room: {notification.roomNumber}</p>
              <p>Date: {notification.date}</p>
              <p>Time: {notification.time} - {notification.endtime}</p>
              <p>For the Reason: {notification.reason}</p>
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

            </div>
          ))
        )}

      </div>
      <div className='viewallcon'>
        <p className='viewalltext' onClick={handleview}>View All</p>
      </div>
    </div>
  );
}

export default NotificationForm;
