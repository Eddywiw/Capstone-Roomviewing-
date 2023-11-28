import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firestore';

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
    <div className="event-edit-modal">
      <h2>Edit Event</h2>
      <input
        type="text"
        value={updatedEvent.title}
        onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
      />
      {/* Include input fields for other event properties like start and end here */}
      <button onClick={handleUpdate}>Save Changes</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default EventEditModal;
