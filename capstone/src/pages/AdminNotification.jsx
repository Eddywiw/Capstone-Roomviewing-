import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './AdminNotification.css'
import AdminAccepted from '../components/AdminAccepted';
import AdminDeclined from '../components/AdminDeclined';
import AdminPending from '../components/AdminPending';
function AdminNotification() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };
  return (
    <div>
      <div>
        <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabSelect}>
          <TabList>
            <Tab>Pending</Tab>
            <Tab>Accepted</Tab>
            <Tab>Declined</Tab>
          </TabList>
          <TabPanel >
            <div >
                <p>Pending</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              <p>Accepted</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              <p>Declined</p>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminNotification