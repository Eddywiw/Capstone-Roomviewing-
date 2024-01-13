import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { ListGroup, Button, Modal } from 'react-bootstrap';
import './SubjectList.css';

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [removeConfirmation, setRemoveConfirmation] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subject'), (querySnapshot) => {
      const subjectList = [];
      querySnapshot.forEach((doc) => {
        subjectList.push({ id: doc.id, ...doc.data() });
      });
      setSubjects(subjectList);
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = (subjectId, subjectName) => {
    setRemoveConfirmation({
      subjectId,
      subjectName,
    });
  };

  const confirmRemove = async () => {
    const { subjectId, subjectName } = removeConfirmation;

    try {
      await deleteDoc(doc(db, 'subject', subjectId));
      await addDoc(collection(db, 'subjectArchives'), {
        Subjectname: subjectName,
      });

      setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== subjectId));
    } catch (error) {
      console.error('Error removing document: ', error);
    } finally {
      setRemoveConfirmation(null);
    }
  };

  const cancelRemove = () => {
    setRemoveConfirmation(null);
  };

  return (
    <div className="subject-list-container">
      <ListGroup>
        {subjects.map((subject) => (
          <ListGroup.Item key={subject.id} className='d-flex justify-content-between align-items-center'style={{ gap: 100 }}>
            <span>{subject.Subjectname}</span>
            <Button variant='danger' onClick={() => handleRemove(subject.id, subject.Subjectname)} >
              Remove
            </Button>

          </ListGroup.Item>
        ))}
      </ListGroup>

      {removeConfirmation && (
        <Modal show={true} onHide={cancelRemove} centered>
          <Modal.Header closeButton>
            <Modal.Title>{`Are you sure you want to remove ${removeConfirmation.subjectName}?`}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ margin: '20px' }}>
            <div className='d-flex justify-content-around'>
              <Button variant='primary' onClick={confirmRemove}>
                Yes
              </Button>
              <Button variant='secondary' onClick={cancelRemove}>
                No
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default SubjectList;
