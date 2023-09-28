import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';

function UpdateRoom({ onClose, currentRoom, onUpdatedRoom }) {
  const [updatedRoom, setUpdatedRoom] = useState({
    Roomno: currentRoom.Roomno,
    Floor: currentRoom.Floor,
    Capacity: currentRoom.Capacity,
    Status: currentRoom.Status
  });

  const [isUpdating, setIsUpdating] = useState(false); // State to control button disabling

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedRoom({ ...updatedRoom, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true); // Disable the button during update
  
    try {
      const roomRef = doc(db, 'rooms', currentRoom.id);
      await updateDoc(roomRef, {
        Roomno: updatedRoom.Roomno,
        Floor: updatedRoom.Floor,
        Capacity: updatedRoom.Capacity,
        Status: updatedRoom.Status
      });
  
      // Update the roomEntries state with the updated data
      onUpdatedRoom({
        id: currentRoom.id,
        ...updatedRoom
      });
  
      // Close the UpdateUser modal after successful update
      onClose();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  
    setIsUpdating(false); // Re-enable the button after update
  };
  

  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Update Room</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="Roomno"
            value={updatedRoom.Roomno}
            onChange={handleChange}
            required
          />
          <label htmlFor="Roomno">Room:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="Floor"
            value={updatedRoom.Floor}
            onChange={handleChange}
            required
          />
          <label htmlFor="Floor">Floor:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="Capacity"
            value={updatedRoom.Capacity}
            onChange={handleChange}
            required
          />
          <label htmlFor="Capacity">Capacity:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="Status"
            value={updatedRoom.Status}
            onChange={handleChange}
            required
          />
          <label htmlFor="Status">Status:</label>
        </div>
        <button className="updateroombtn" type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export default UpdateRoom;
