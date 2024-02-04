import React, { useState } from 'react';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, storage } from '../config/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Modal, Button, Form } from 'react-bootstrap';
import './CreateRoom.css';

function CreateRoom({ onClose, onRoomAdded }) {
  const [newRoom, setNewRoom] = useState({
    roomnum: "",
    floor: "",
    capacity: "",
    status: "",
    imageurl: null, // Initialize imageurl as null
    imageurl2: null, 
    imageurl3: null, 
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
      const uploadedImageUrls = [];

      for (const field in newRoom) {
        if (field.startsWith('imageurl')) {
          const image = newRoom[field];
          if (image) {
            const uniqueFilename = uuidv4();
            const imageRef = ref(storage, `images/${uniqueFilename}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            uploadedImageUrls.push(imageUrl);
          }
        }
      }

      const docRef = await addDoc(collection(db, "rooms"), {
        Roomno: newRoom.roomnum,
        Floor: newRoom.floor,
        Capacity: newRoom.capacity,
        Status: "Available",
        ImageUrl: uploadedImageUrls[0], // First image
        ImageUrl2: uploadedImageUrls[1], // Second image
        ImageUrl3: uploadedImageUrls[2], // Third image
      });

      onRoomAdded({
        Roomno: newRoom.roomnum,
        Floor: newRoom.floor,
        Capacity: newRoom.capacity,
        Status: "Available",
        ImageUrl: uploadedImageUrls[0],
        ImageUrl2: uploadedImageUrls[1],
        ImageUrl3: uploadedImageUrls[2],
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
        imageurl2: null, 
        imageurl3: null,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setAlertMessage("Error adding room. Please try again.");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRoomnum">
            <Form.Label>Room:</Form.Label>
            <Form.Control
              type="text"
              name="roomnum"
              value={newRoom.roomnum}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFloor">
            <Form.Label>Floor:</Form.Label>
            <Form.Control
              as="select"
              name="floor"
              value={newRoom.floor}
              onChange={handleChange}
              required
            >
              <option value="">Select Floor</option>
              <option value="First Floor">First Floor</option>
              <option value="Second Floor">Second Floor</option>
              <option value="Third Floor">Third Floor</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formCapacity">
            <Form.Label>Capacity:</Form.Label>
            <Form.Control
              type="text"
              name="capacity"
              value={newRoom.capacity}
              onChange={handleChange}
              required
            />
          </Form.Group>
       
          <Form.Group controlId="formImageurl">
            <Form.Label>Image 1:</Form.Label>
            <Form.Control
              type="file"
              name="imageurl"
              accept=".jpg, .jpeg, .png"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formImageurl">
            <Form.Label>Image 2:</Form.Label>   
            <Form.Control
              type="file"
              name="imageurl2"
              accept=".jpg, .jpeg, .png"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formImageurl">
            <Form.Label>Image 3:</Form.Label>
            <Form.Control
              type="file"
              name="imageurl3"
              accept=".jpg, .jpeg, .png"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
        {alertMessage && (
          <div className="alert-message">
            {alertMessage}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default CreateRoom;
