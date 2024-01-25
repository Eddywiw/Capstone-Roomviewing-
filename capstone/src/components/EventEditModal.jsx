import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';
import './EventEditModal.css';
import { Modal, Button, Form } from 'react-bootstrap';

function EventEditModal({ event, onClose, onUpdate }) {
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const handleUpdate = async () => {
    try {
      if (!db) {
        console.error('Firestore is not initialized. Check your configuration.');
        return;
      }

      const eventDocRef = doc(db, 'schedules', event.id);
      console.log('Document Reference:', eventDocRef);

      // Update the event in Firestore
      await updateDoc(eventDocRef, {
        Title: updatedEvent.title,
        Professor: updatedEvent.professor,
        Roomno: updatedEvent.roomno,
        Start: updatedEvent.start,
        End: updatedEvent.end,
      });

      // Perform the event update in your local state
      onUpdate(updatedEvent);

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={updatedEvent.title}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formStart">
            <Form.Label>Start</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              value={updatedEvent.start.toISOString().slice(0, -8)}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, start: new Date(e.target.value) })}
            />
          </Form.Group>
          <Form.Group controlId="formEnd">
            <Form.Label>End</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              value={updatedEvent.end.toISOString().slice(0, -8)}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, end: new Date(e.target.value) })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventEditModal;
