import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { AdminSidebarData } from './AdminSidebar';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import { BsBell } from "react-icons/bs"; // Import the notification icon
import NotificationForm from './Notification';
const Nav = styled.div`
  background: #005173;
  height: 60px;
  display: flex;
  justify-content: space-between; /* Updated */
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 1.3rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #005173;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const NotificationIcon = styled.div`
 margin-right: 2rem;
  font-size: 1.1rem; /* Adjust the size as needed */
  cursor: pointer;
  
`;


const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [showNotification, setShowNotification] = useState(false); 
  const showSidebar = () => setSidebar(!sidebar);
  const handleNotificationClick = () => {
    setShowNotification(true);
  };
  const handleCloseNotification = () => {
    setShowNotification(false); 
  }
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavIcon to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
          </NavIcon>
          <NotificationIcon className="notification-icon" onClick={handleNotificationClick}>
            <BsBell />
          </NotificationIcon>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {AdminSidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
        {showNotification && (
              <NotificationForm onClose={handleCloseNotification} />
            )}
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;