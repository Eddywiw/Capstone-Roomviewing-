import React, { useState, useEffect } from 'react';
import './ManageRoom.css';
import { collection, getDocs } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import CreateRoom from '../components/CreateRoom';
import UpdateRoom from '../components/UpdateRoom';
import { v4 } from 'uuid';
import { uploadBytes } from 'firebase/storage';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManageRoom() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomEntries, setRoomEntries] = useState([]);
  const [isCreateRoomVisible, setIsCreateRoomVisible] = useState(false);
  const [isUpdateRoomVisible, setIsUpdateRoomVisible] = useState(false);

  const handleStudentAdded =(newRoom) =>{
    setRoomEntries((prevUsers) => [...prevUsers, newRoom])
  }
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRoomEntries(roomsData);
    };

    fetchData();
  }, []);

  const toggleCreateRoom = () => {
    setIsCreateRoomVisible(!isCreateRoomVisible);
  };

  const handleCloseRoom = () => {
    setIsCreateRoomVisible(false);
  };

  const handleDeleteBtnClick = async (roomId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this room?');

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        setRoomEntries((prevUsers) => prevUsers.filter((user) => user.id !== roomId));
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const toggleUpdateRoom = (user) => {
    setCurrentRoom(user);
    setIsUpdateRoomVisible(!isUpdateRoomVisible);
  };

  const handleCloseUpdateRoom = () => {
    setIsUpdateRoomVisible(false);
  };

  const handleUpdateRoom = (updatedRoom) => {
    setRoomEntries((prevEntries) =>
      prevEntries.map((entry) => (entry.id === updatedRoom.id ? { ...entry, ...updatedRoom } : entry))
    );
  };

  function formatTimeWithAMPM(timeString) {
    const [hours, minutes] = timeString.split(':');
    const formattedHours = parseInt(hours, 10);
    const ampm = formattedHours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${(formattedHours % 12) || 12}:${minutes} ${ampm}`;

    return formattedTime;
  }

  return (
    <div className='container mt-4'>
      <div className='bg-light p-4 rounded'>
      <div className='addroom-container'>
        <Button variant='outline-primary' onClick={toggleCreateRoom}>
          ADD +
        </Button>
      </div>

      <Row xs={1} md={3} className='g-4 room-container'>
        {roomEntries.map((entry) => (
          <Col key={entry.id}>
            <Card className='h-100'>
              <Card.Img variant='top' src={entry.ImageUrl} alt='Room Image' style={{ maxHeight: '250px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{`Room: ${entry.Roomno}`}</Card.Title>
                <Card.Text>{`Floor: ${entry.Floor}`}</Card.Text>
                <Card.Text>{`Capacity: ${entry.Capacity}`}</Card.Text>
                <Card.Text>{`Status: ${entry.Status}`}</Card.Text>
                <div className='bookBTN-container'>
                  <Button variant='outline-primary' onClick={() => toggleUpdateRoom(entry)}>
                    Edit
                  </Button>
                  <Button variant='outline-danger' onClick={() => handleDeleteBtnClick(entry.id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {isCreateRoomVisible && (
        <CreateRoom
          db={db}
          setRoomEntries={setRoomEntries}
          toggleCreateRoom={toggleCreateRoom}
          onClose={handleCloseRoom}
          onRoomAdded={handleStudentAdded}
        />
      )}

      {isUpdateRoomVisible && currentRoom && (
        <UpdateRoom
          toggleUpdateRoom={toggleUpdateRoom}
          onClose={handleCloseUpdateRoom}
          currentRoom={currentRoom}
          onUpdatedRoom={handleUpdateRoom}
        />
      )}
      </div>
    </div>
  );
}

export default ManageRoom;
