import React, { useState, useEffect } from 'react';
import './ManageRoom.css';
import { collection, getDocs } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firestore';
import { deleteDoc, doc } from "firebase/firestore";
import CreateRoom from '../components/CreateRoom'; // Import the CreateRoom component
import UpdateRoom from '../components/UpdateRoom';
import { ref } from 'firebase/storage'
import { v4 } from 'uuid'
import { uploadBytes } from 'firebase/storage';

function ManageRoom() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomEntries, setRoomEntries] = useState([]); // State to store the fetched room data
  const [isCreateRoomVisible, setIsCreateRoomVisible] = useState(false); // State to manage CreateRoom visibility
  const[isUpdateRoomVisivle, setIsUpdateRoomVisible] = useState(false);
 
  const handleStudentAdded = (newRoom) => {
    setRoomEntries((prevUsers) => [...prevUsers, newRoom]);
  };
  useEffect(() => {
    // Fetch data from the "rooms" collection in Firebase
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoomEntries(roomsData);
    };

    fetchData();
  }, []); // Run this effect only once, similar to componentDidMount
  const toggleCreateRoom = () => {
    setIsCreateRoomVisible(!isCreateRoomVisible);
  };
  const handleCloseRoom = () => {
    setIsCreateRoomVisible(false);
  };
  const handleDeleteBtnClick = async (roomId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      // After successfully deleting the document, update the state to remove the deleted user from the table
      setRoomEntries((prevUsers) => prevUsers.filter((user) => user.id !== roomId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const toggleUpdateRoom = (user) => {
    setCurrentRoom(user);
    setIsUpdateRoomVisible(!isUpdateRoomVisivle);
  };
  const handleCloseUpdateRoom = () => {
    setIsUpdateRoomVisible(false);
  };
 
  function formatTimeWithAMPM(timeString) {
    const [hours, minutes] = timeString.split(':');
    const formattedHours = parseInt(hours, 10);
    const ampm = formattedHours >= 12 ? 'PM' : 'AM';
    const formattedTime =
      `${(formattedHours % 12) || 12}:${minutes} ${ampm}`;
  
    return formattedTime;
  }

   const handleUpdateRoom = (updatedRoom) => {
    // Update the roomEntries state with the updated data
    setRoomEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === updatedRoom.id ? { ...entry, ...updatedRoom } : entry
      )
    );
  };

  
  return (
    <div className='bg-room-con'>
      <div className='addroom-container'>
        <button  onClick={toggleCreateRoom} className='addBTN'>ADD +</button>
      </div>
      <div className='room-container'>
        
      {roomEntries.map(entry => (
        <div key={entry.id} className='card2'>   
          <div className='Card'>
            <div className='card-image' style={{ backgroundImage: `url(${entry.ImageUrl})` }}>
              {/* Display the image */}
            </div>
            <p className='card-title'>Room: {entry.Roomno}</p>                 
            <div className='floor-capacity-con'>
              <p className='card-body'>Floor: {entry.Floor}</p>
              <p className='card-capacity'>Capacity: {entry.Capacity}</p>
            </div>                              
            <p className='card-status'>Status: {entry.Status}</p>
            <div className='bookBTN-container'>
              <button className='cardEditBTN' onClick={() => toggleUpdateRoom(entry)}>Edit</button>
              <button onClick={() => handleDeleteBtnClick(entry.id)} className='cardDeletekBTN'>Delete</button>                
            </div>
          </div>
          {isCreateRoomVisible && (
            <CreateRoom
              db={db}
              setRoomEntries={setRoomEntries}
              toggleCreateRoom={toggleCreateRoom}
              onClose={handleCloseRoom}
              onRoomAdded={handleStudentAdded}
            />
          )}
          {isUpdateRoomVisivle && currentRoom && (
              <UpdateRoom 
                toggleUpdateRoom={toggleUpdateRoom} 
                onClose={handleCloseUpdateRoom}
                currentRoom={currentRoom}
                onUpdatedRoom={handleUpdateRoom}
              />
            )}
        </div>
      ))}
      </div>
    </div>
  );
}

export default ManageRoom;
