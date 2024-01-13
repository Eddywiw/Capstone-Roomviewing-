import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './AssignProf.css';

function AssignProf() {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const professorSnapshot = await getDocs(collection(db, 'professor'));
        const professorList = [];
        professorSnapshot.forEach((doc) => {
          professorList.push({ id: doc.id, ...doc.data() });
        });
        setProfessors(professorList);
      } catch (error) {
        console.error('Error fetching professors: ', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subject'));
        const subjectList = [];
        querySnapshot.forEach((doc) => {
          subjectList.push({ id: doc.id, ...doc.data() });
        });
        setSubjectList(subjectList);
      } catch (error) {
        console.error('Error fetching subjects: ', error);
      }
    };

    fetchProfessors();
    fetchSubjects();
  }, []);

  const handleProfessorChange = (event) => {
    setSelectedProfessor(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleAssign = async () => {
    if (selectedProfessor && selectedSubject) {
      try {
        const professorRef = doc(db, 'professor', selectedProfessor);
        const professorSnap = await getDoc(professorRef);
        const professorName = professorSnap.data().Name;

        const subjectRef = doc(db, 'subject', selectedSubject);
        const subjectSnap = await getDoc(subjectRef);
        const subjectName = subjectSnap.data().Subjectname;

        await addDoc(collection(db, 'teacher_subject'), {
          teacherId: selectedProfessor,
          teacherName: professorName,
          subjectId: selectedSubject,
          subjectName: subjectName,
        });

        setSelectedProfessor('');
        setSelectedSubject('');

        console.log('Teacher assigned to subject.');
      } catch (error) {
        console.error('Error assigning teacher: ', error);
      }
    } else {
      console.error('Please select both a teacher and a subject.');
    }
  };

  return (
    <div className="assign-prof-container">
      <Form>
        <Form.Group as={Row} controlId="professorSelect">
          <Col sm={{ span: 10, offset: 1 }} className="text-center">
            <Form.Control
              as="select"
              value={selectedProfessor}
              onChange={handleProfessorChange}
              style={{ height: '50px' }} // Adjust the height as needed
            >
              <option value="">Select a Professor</option>
              {professors.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.Name}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="subjectSelect">
          <Col sm={{ span: 10, offset: 1 }} className="text-center">
            <Form.Control
              as="select"
              value={selectedSubject}
              onChange={handleSubjectChange}
              style={{ height: '50px' }} // Adjust the height as needed
            >
              <option value="">Select a Subject</option>
              {subjectList.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.Subjectname}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>

        <Button onClick={handleAssign} className="assign-button mx-auto d-block">
          Assign Professor to Subject
        </Button>
      </Form>
    </div>
  );
}

export default AssignProf;
