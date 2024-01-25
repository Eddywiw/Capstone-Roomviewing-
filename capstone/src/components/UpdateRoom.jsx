import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../config/firestore';
import { Modal, Button, Form } from 'react-bootstrap';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function UpdateRoom({ onClose, currentRoom, onUpdatedRoom }) {
  const [updatedRoom, setUpdatedRoom] = useState({
    Roomno: currentRoom.Roomno,
    Floor: currentRoom.Floor,
    Capacity: currentRoom.Capacity,
    Status: currentRoom.Status,
    ImageUrl: currentRoom.ImageUrl, // Maintain the existing image URL
    NewImage: null, // New image file to be uploaded
  });

  const [isUpdating, setIsUpdating] = useState(false); // State to control button disabling
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    if (type === "file") {
      const file = event.target.files[0];
      setUpdatedRoom({ ...updatedRoom, NewImage: file });
    } else {
      setUpdatedRoom({ ...updatedRoom, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true); // Disable the button during update

    try {
      // Check if there is a new image to upload
      if (updatedRoom.NewImage) {
        const uniqueFilename = currentRoom.id; // Use the existing room ID as the filename
        const imageRef = ref(storage, `images/${uniqueFilename}`);
        await uploadBytes(imageRef, updatedRoom.NewImage);
        const imageUrl = await getDownloadURL(imageRef);

        // Update the room with the new image URL
        await updateDoc(doc(db, 'rooms', currentRoom.id), {
          Roomno: updatedRoom.Roomno,
          Floor: updatedRoom.Floor,
          Capacity: updatedRoom.Capacity,
          Status: updatedRoom.Status,
          ImageUrl: imageUrl,
        });

        // Update the roomEntries state with the updated data
        onUpdatedRoom({
          id: currentRoom.id,
          ...updatedRoom,
          ImageUrl: imageUrl,
        });
      } else {
        // If no new image, update other room details only
        await updateDoc(doc(db, 'rooms', currentRoom.id), {
          Roomno: updatedRoom.Roomno,
          Floor: updatedRoom.Floor,
          Capacity: updatedRoom.Capacity,
          Status: updatedRoom.Status,
        });

        // Update the roomEntries state with the updated data
        onUpdatedRoom({
          id: currentRoom.id,
          ...updatedRoom,
        });
      }
      alert(`Room ${updatedRoom.Roomno} updated successfully!`);


      // Close the UpdateUser modal after successful update
      onClose();
    } catch (error) {
      console.error('Error updating document: ', error);
      setAlertMessage("Error updating room. Please try again.");

    }

    setIsUpdating(false); // Re-enable the button after update
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRoomno">
            <Form.Label>Room:</Form.Label>
            <Form.Control
              type="text"
              name="Roomno"
              value={updatedRoom.Roomno}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFloor">
            <Form.Label>Floor:</Form.Label>
            <Form.Control
              type="text"
              name="Floor"
              value={updatedRoom.Floor}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCapacity">
            <Form.Label>Capacity:</Form.Label>
            <Form.Control
              type="text"
              name="Capacity"
              value={updatedRoom.Capacity}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formImageurl">
            <Form.Label>New Image:</Form.Label>
            <Form.Control
              type="file"
              name="NewImage"
              accept=".jpg, .jpeg, .png"
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
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

export default UpdateRoom;
