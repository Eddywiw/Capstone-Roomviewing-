import React, { useState, useEffect } from 'react';
import ScheduleTBL from '../components/scheduleTBL';
import { db } from '../config/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import * as IoIcons from 'react-icons/io';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Row, Col, Card } from 'react-bootstrap'; // Import Bootstrap components

function AdminHome() {
  const [totalStudentsBSIT, setTotalStudentsBSIT] = useState(0);
  const [totalStudentsBSBA, setTotalStudentsBSBA] = useState(0);
  const [totalStudentsHRS, setTotalStudentsHRS] = useState(0);
  const [totalprof, setTotalprof] = useState(0);

  useEffect(() => {
    const bsitCollection = collection(db, 'bsit');
    const bsbaCollection = collection(db, 'bsba');
    const hrsCollection = collection(db, 'hrs');
    const profCollection = collection(db, 'professor');

    const unsubscribeProf = onSnapshot(profCollection, (querySnapshot) => {
      setTotalprof(querySnapshot.size);
    });
    const unsubscribeBSIT = onSnapshot(bsitCollection, (querySnapshot) => {
      setTotalStudentsBSIT(querySnapshot.size);
    });
    const unsubscribeBSBA = onSnapshot(bsbaCollection, (querySnapshot) => {
      setTotalStudentsBSBA(querySnapshot.size);
    });
    const unsubscribeHRS = onSnapshot(hrsCollection, (querySnapshot) => {
      setTotalStudentsHRS(querySnapshot.size);
    });

    return () => {
      unsubscribeProf();
      unsubscribeBSIT();
      unsubscribeBSBA();
      unsubscribeHRS();
    };
  }, []);

  const totalStudents = totalStudentsBSIT + totalStudentsBSBA + totalStudentsHRS;

  return (
    <div className='container mt-4'>
      <div className='bg-light p-4 rounded'>
        <h3 className='mb-4'>My Dashboard</h3>

        <Row className='mb-4'>
          <Col lg={4} md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Total Students</Card.Title>
                <Card.Text>
                  <p>Total Students: {totalStudents}</p>
                </Card.Text>
                <IoIcons.IoMdPeople className='icon-people1' />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Total Professors</Card.Title>
                <Card.Text>
                  <p>Total Professors: {totalprof}</p>
                </Card.Text>
                <IoIcons.IoMdPeople className='icon-people' />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className='schedule-con'>
          <ScheduleTBL />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
