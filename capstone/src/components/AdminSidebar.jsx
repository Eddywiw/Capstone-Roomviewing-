import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const AdminSidebarData = [

  {
    title: "Home",
    path: "/adminhome",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Manage Room",
    path: "/manageroom",
    icon: <IoIcons.IoMdList/>,
    cName: "nav-text",
  },
  {
    title: "Manage Subject",
    path: "/managesubject",
    icon: <FaIcons.FaList />,
    cName: "nav-text",
  },
  {
    title: "Manage Accounts",
    path: "/admin",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Manage Teacher",
    path: "/mngteacher",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Logout",
    path: "/",
    icon: <FaIcons.FaSignOutAlt />,
    cName: "nav-text",
   

  },
];
