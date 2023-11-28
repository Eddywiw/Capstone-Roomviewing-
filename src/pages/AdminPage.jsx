import React, { useState } from 'react';
import Users from '../components/Users';
import Professor from '../components/Professor';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './AdminPage.css';
import CreateUser from '../components/CreateUser';

function AdminPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };
  
  return (
    <div className='admin-main-container'>
      <div className="tabbed-interface">
        <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabSelect}>
          <TabList className="tab-list-con">
            <Tab className="tabs">Student</Tab>
            <Tab className="tabs">Professor</Tab>
          </TabList>
          <TabPanel className="tab-panel-con">
            <div className="Student">
              <Users />
            </div>
          </TabPanel>
          <TabPanel className="tab-panel-con">
            <div className="Professor">
              <Professor />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;
