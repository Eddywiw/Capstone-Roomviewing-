import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firestore';

function ScheduleArchives() {
  const [acceptData, setAcceptData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'ScheduleArchives'), (querySnapshot) => {
      const acceptData = [];
      querySnapshot.forEach((doc) => {
        acceptData.push({ id: doc.id, ...doc.data() });
      });
      setAcceptData(acceptData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-1">Schedule Archives</h2>
      {acceptData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul className="list-group">
          {acceptData.map((data) => (
            <li className="list-group-item" key={data.id}>
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{data.Professor}</h5>
                <small>{data.Start.toDate().toLocaleString()}| {data.End.toDate().toLocaleTimeString()}</small>
                </div>
                <p className="mb-1">
                Room: {data.Roomno} | Teacher: {data.Title}
                </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ScheduleArchives;
