import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firestore';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function NotificationArchives() {
  const [notfiarchive, setNotif] = useState([]);

  useEffect(() => {
    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(collection(db, 'notification_archive'), (querySnapshot) => {
      const notifList = [];
      querySnapshot.forEach((doc) => {
        notifList.push({ id: doc.id, ...doc.data() });
      });
      setNotif(notifList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="container mt-4">
      <ul className="list-group">
        {notfiarchive.map((notif) => (
          <li key={notif.id} className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{notif.reason}</h5>
              <small>{notif.date} | {notif.time}</small>
            </div>
            <p className="mb-1">
              Room: {notif.roomNumber} | Teacher: {notif.teacherName} | Type: {notif.type}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationArchives;
