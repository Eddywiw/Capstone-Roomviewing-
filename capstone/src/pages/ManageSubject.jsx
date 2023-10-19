import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './ManageSubject.css'
import AddSubject from '../components/AddSubject';
import SubjectList from '../components/SubjectList';
import AssignProf from '../components/AssignProf';
function ManageSubject() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };
  return (
    <div>
      <div className='tab-con'>
        <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabSelect}>
          <TabList>
            <Tab >Add Subject</Tab>
            <Tab >Assign Professor/Teacher</Tab>
          </TabList>
          <TabPanel className="tab-panel-ko">
            <div className='addsub-conko'>
                <AddSubject/>
                <SubjectList/>
            </div>
          </TabPanel>
          <TabPanel className="tab-panel-ko">
            <div>
              <AssignProf/>
             
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

export default ManageSubject