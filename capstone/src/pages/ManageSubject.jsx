import React, { useState } from 'react';
import { Tab, Nav, Row, Col, TabContent, TabPane } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageSubject.css';
import AddSubject from '../components/AddSubject';
import SubjectList from '../components/SubjectList';
import AssignProf from '../components/AssignProf';
import ProfessorSubjectTable from '../components/ProfessorSubjectTable';

function ManageSubject() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };
  
  return (
    <div className='container mt-4'>
      <div className='bg-light p-4 rounded'>
        <div className='tab-con'>
          <Tab.Container activeKey={selectedTabIndex} onSelect={handleTabSelect}>
            <Row className='justify-content-center'>
              <Nav variant='tabs' className='mb-3'>
                <Nav.Link eventKey={0}>Add Subject</Nav.Link>
                <Nav.Link eventKey={1}>Assign Professor/Teacher</Nav.Link>
              </Nav>
            </Row>
            <Row className='justify-content-center'>  
              <Col sm={12}>
                <Tab.Content>
                  <TabPane eventKey={0}>
                    <div className='d-flex flex-column align-items-center'>
                      <AddSubject />
                      <SubjectList />
                    </div>
                  </TabPane>
                  <TabPane eventKey={1}>
                    <div className='d-flex flex-row align-items-center'  style={{ justifyContent: 'space-between'}}>
                      <AssignProf />
                      <ProfessorSubjectTable />
                    </div>
                  </TabPane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}

export default ManageSubject;
