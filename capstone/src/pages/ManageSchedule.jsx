import React, { useState } from 'react';
import './ManageSchedule.css';
import AdminCalendar from '../components/adminCalendar';
import Calendar from '../components/calendar';
import InsertEvent from '../components/InsertEvent';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManageSchedule() {
  const [addevent, setAddevent] = useState(false);
  const toggleCreateRoom = () => {
    setAddevent(true);
  };

  const handleCloseRoom = () => {
    setAddevent(false);
  };

  return (
    <div className='container mt-4'>
      <div className='bg-light p-4 rounded'>
        <div className='addeventcon'>
          <Button variant='outline-primary' onClick={toggleCreateRoom}>
            ADD +
          </Button>
        </div>
        <div className='mng-con'>
          <Calendar />
        </div>
      </div>

      {addevent && (
        <Modal
          show={addevent}
          onHide={handleCloseRoom}
          centered
          size="md" // Adjust the size as needed
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Content of your modal */}
            <InsertEvent toggleaddevent={toggleCreateRoom} onClose={handleCloseRoom} />
          </Modal.Body>
          {/* Add additional Modal.Footer if needed */}
        </Modal>
      )}
    </div>
  );
}

export default ManageSchedule;
