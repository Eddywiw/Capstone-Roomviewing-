import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from '../config/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import './CreateRoom.css';

function CreateRoom({ onClose, onRoomAdded }) {
  const [newRoom, setNewRoom] = useState({
    roomnum: "",
    floor: "",
    capacity: "",
    status: "",
    imageurl: null, // Initialize imageurl as null
  });

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    if (type === "file") {
      // Handle file input separately
      const file = event.target.files[0]; // Get the selected file

      // Update the imageurl with the selected file
      setNewRoom({ ...newRoom, [name]: file });
    } else if (name === "start" || name === "end") {
      const [hours, minutes] = value.split(":");
      const formattedTime = `${hours}:${minutes}`;
      setNewRoom({ ...newRoom, [name]: formattedTime });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const uniqueFilename = uuidv4();
      const imageRef = ref(storage, `images/${uniqueFilename}`);
      await uploadBytes(imageRef, newRoom.imageurl);
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "rooms"), {
        Roomno: newRoom.roomnum,
        Floor: newRoom.floor,
        Capacity: newRoom.capacity,
        Status: newRoom.status,
        ImageUrl: imageUrl,
      });

      onRoomAdded({
        Roomno: newRoom.roomnum,
        Floor: newRoom.floor,
        Capacity: newRoom.capacity,
        Status: newRoom.status,
        ImageUrl: imageUrl,
      });

      console.log("Document written with ID: ", docRef.id);
      onClose();
      setNewRoom({
        roomnum: "",
        floor: "",
        capacity: "",
        status: "",
        imageurl: null, // Reset imageurl to null
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
      
  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Add Room</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="roomnum"
            value={newRoom.roomnum}
            onChange={handleChange}
            required
          />
          <label htmlFor="roomnum">Room:</label>
        </div>

       
        
        

        <div className="group">
          <input
            placeholder=""
            type="text"
            name="floor"
            value={newRoom.floor}
            onChange={handleChange}
            required
          />
          <label htmlFor="floor">Floor:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="capacity"
            value={newRoom.capacity}
            onChange={handleChange}
            required
          />
          <label htmlFor="capacity">Capacity:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="status"
            value={newRoom.status}
            onChange={handleChange}
            required
          />
          <label htmlFor="status">Status:</label>
        </div>

        <div className="group">
          <input
            placeholder=""
            type="file"
            name="imageurl"
           
            onChange={handleChange}
            required
          />
          
        </div>
        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
    </div>
  )
}

export default CreateRoom