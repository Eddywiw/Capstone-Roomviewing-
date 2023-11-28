import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./sidebar";
import "../App.css";
import './navbar.css'
import LogoutForm from "./LogoutForm";
import { IconContext } from "react-icons";
import { BsBell } from "react-icons/bs";  
import NotificationUser from "./NotificationUser";
function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [showLogoutForm, setShowLogoutForm] = useState(false); 
  const [showNotification, setShowNotification] = useState(false); 
  const [lblNavText, setLblNavText] = useState("Home");
  const showSidebar = () => setSidebar(!sidebar);
  const handleNotificationClick = () => {
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };
 
  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
        
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className="lbl_nav">
            <p>{lblNavText}</p>
          </div>
          <div className="notification-icon-user" onClick={handleNotificationClick}>
            <BsBell />
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                 {item.title === "Logout" ? (
                    <Link to="#" onClick={() => setShowLogoutForm(true)}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <Link to={item.path} onClick={() => setLblNavText(item.title)}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          

        </nav>
        {showLogoutForm && <LogoutForm/>}
        {showNotification && (
        <NotificationUser onClose={handleCloseNotification} />
      )}
      </IconContext.Provider>
    </>
  );
}

export default Navbar;

