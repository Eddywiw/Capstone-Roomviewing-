import React,{useState} from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firestore';
import './CreateRoom.css'
function CreateRoom({onClose,onRoomAdded}) {
    const [newRoom, setNewRoom] = useState({
        roomnum: "",
        floor:"",
        capacity: "",
        status: "",
        
        professor:"",
        event_tittle:""
    });
    const handleChange = (event) => {
      const { name, value } = event.target;
    
      if (name === "start" || name === "end") {
        // Extract the hours and minutes from the value
        const [hours, minutes] = value.split(":");
        // Format the time as "HH:mm"
        const formattedTime = `${hours}:${minutes}`;
    
        setNewRoom({ ...newRoom, [name]: formattedTime });
      } else {
        setNewRoom({ ...newRoom, [name]: value });
      }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const docRef = await addDoc(collection(db, "rooms"), {
            Roomno: newRoom.roomnum,
            Floor: newRoom.floor,
            Capacity: newRoom.capacity,
            Status: newRoom.status,
            
            Professor: newRoom.professor,
            Event_tittle: newRoom.event_tittle
          });
    
          // Call the onStudentAdded callback with the new student data
          onRoomAdded({
            Roomno: newRoom.roomnum,
            Floor: newRoom.floor,
            Capacity: newRoom.capacity,
            Status: newRoom.status,
          
            Professor: newRoom.professor,
            Event_tittle: newRoom.event_tittle
          });
    
          console.log("Document written with ID: ", docRef.id);
    
          // Close the CreateUser modal after successful addition
          onClose();
    
          // Clear the form inputs after successful addition
          setNewRoom({
            roomnum: "",
            floor:"",
            capacity: "",
            status: "",
            start: "",
            end: "" ,
            professor:"",
            event_tittle:""
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
            name="event_tittle"
            value={newRoom.event_tittle}
            onChange={handleChange}
            required
          />
          <label htmlFor="event_tittle">Event Tittle:</label>
        </div>

        <div className="group">
          <input
            placeholder=""
            type="text"
            name="professor"
            value={newRoom.professor}
            onChange={handleChange}
            required
          />
          <label htmlFor="professor">Professor:</label>
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
        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
    </div>
  )
}

export default CreateRoom