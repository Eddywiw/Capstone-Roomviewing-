import React, { useState } from 'react';
import { collection, addDoc, getDocs } from "firebase/firestore";
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

  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type } = event.target;
  
    if (type === "file") {
      const file = event.target.files[0];
  
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        event.target.value = "";
        return;
      }
  
      setNewRoom({ ...newRoom, [name]: file });
    } else if (name === "start" || name === "end") {
      const [hours, minutes] = value.split(":");
      const formattedTime = `${hours}:${minutes}`;
      setNewRoom({ ...newRoom, [name]: formattedTime });
    } else if (name === "capacity") {
      // Validate that the input is a number
      const isValidNumber = /^\d+$/.test(value);
  
      if (!isValidNumber) {
        alert("Please enter a valid number for Capacity.");
        return;
      }
  
      setNewRoom({ ...newRoom, [name]: value });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };
  

  const handleSubmit = async (event) => {
  event.preventDefault();

  const existingRoomQuery = collection(db, "rooms");
  const existingRoomSnapshot = await getDocs(existingRoomQuery);
  const existingRooms = existingRoomSnapshot.docs.map((doc) => doc.data());

  if (existingRooms.some((room) => room.Roomno === newRoom.roomnum)) {
    setAlertMessage('A room with the same room number already exists. Please use a different room number.');
    return;
  }

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

    setAlertMessage("Room successfully added!");
    
    // Display alert when the room is successfully added
    window.alert("Room successfully added!");

    onClose();
    setNewRoom({
      roomnum: "",
      floor: "",
      capacity: "",
      status: "",
      imageurl: null,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    setAlertMessage("Error adding room. Please try again.");
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
          <label htmlFor="floor">Floor:</label>
          <select
            name="floor"
            value={newRoom.floor}
            onChange={handleChange}
            required
          >
            <option value="">Select FLoor</option>
            <option value="First Floor">First Floor</option>
            <option value="Second Floor">Second FLoor</option>
            <option value="Third Floor">Third FLoor</option>
          </select>
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
          <label htmlFor="status">Status:</label>
          <select
            name="status"
            value={newRoom.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>

        <div className="group">
          <input
            placeholder=""
            type="file"
            name="imageurl"
            accept=".jpg, .jpeg, .png"
            onChange={handleChange}
            required
          />
        </div>
        <button className='addstubtn' type="submit">
          Add
        </button>

        {alertMessage && (
          <div className="alert-message">
            {alertMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateRoom;