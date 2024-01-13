import React, { useState } from 'react';
import Users from '../components/Users';
import Professor from '../components/Professor';
import CreateUser from '../components/CreateUser';
import { Tab, Nav, Row, Col, TabContent, TabPane } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css';

function AdminPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };

  return (
    <div className='container mt-4'>
      <div className='bg-light p-4 rounded'>
        <Tab.Container activeKey={selectedTabIndex} onSelect={handleTabSelect}>
          <Row>
            <Nav variant='tabs' className='mb-3'>
              <Nav.Item>
                <Nav.Link eventKey={0}>Student</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={1}>Professor</Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
          <Row>
            <Col sm={12}>
              <Tab.Content>
                <TabPane eventKey={0}>
                  <div className='student'>
                    <Users />
                  </div>
                </TabPane>
                <TabPane eventKey={1}>
                  <div className='professor'>
                    <Professor />
                  </div>
                </TabPane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
}

export default AdminPage;
