import React, { useEffect, useState } from 'react';
import { db } from '../config/firestore';
import { collection, getDocs } from 'firebase/firestore';
function ManageTeacher() {
  const [profList, setProfList] = useState([]);
  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'professor'));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProfList(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Manage Teachers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {profList.map((professor) => (
            <tr key={professor.Email}>
              <td>{professor.Name}</td>
              <td>{professor.Email}</td>
              <td>{professor.Password}</td>
              <td>{professor.Position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTeacher;
