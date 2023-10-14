import React, { useState, useEffect } from 'react';
import './ManageRoom.css';
import { collection, getDocs } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firestore';
import { deleteDoc, doc } from "firebase/firestore";
import CreateRoom from '../components/CreateRoom'; // Import the CreateRoom component
import UpdateRoom from '../components/UpdateRoom';
import { Timestamp } from 'firebase/firestore';
import pickoto from '../assets/304.jpg'

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

  const handleUpdateRoom = async (updatedRoom, imageFile) => {
    // Upload the image to Firebase Storage
    const imageRef = storage.ref().child(`roomImages/${updatedRoom.id}`);
    if (imageFile) {
      const imageSnapshot = await imageRef.put(imageFile);
      updatedRoom.imageUrl = await imageSnapshot.ref.getDownloadURL();
    }
  
    // Update the room data in Firestore
    const roomDocRef = doc(db, 'rooms', updatedRoom.id);
    await updateDoc(roomDocRef, updatedRoom);
  
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
              <div className='card-image'>
             
              </div>
              <p className='card-title'>Room: {entry.Roomno}</p>                 
              <div className='floor-capacity-con'>
              <p className='card-body'>Floor: {entry.Floor}</p>
              <p className='card-capacity'>Capacity: {entry.Capacity}</p>
              </div>                              
              <p className='card-status'>Status: {entry.Status}</p>
              

              <label class="custum-file-upload" for="file">
                <div class="icon">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clip-rule="evenodd" fill-rule="evenodd"></path> </g></svg>
                </div>
                <div class="text">
                  <span>Click to upload image</span>
                </div>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    // Store the selected file in a state variable or pass it to the handleUpdateRoom function.
                    // Example: setFileToUpload(file);
                  }}
                />

              </label>

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
