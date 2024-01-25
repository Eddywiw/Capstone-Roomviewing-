import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from 'react-icons/ri'
import * as LiaIcons from 'react-icons/lia'
export const AdminSidebarData = [

  {
    title: "Home",
    path: "/adminhome",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Manage Room",
    path: "/manageroom",
    icon: <IoIcons.IoMdList/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Manage Subject",
    path: "/managesubject",
    icon: <FaIcons.FaList />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Manage Accounts",
    path: "/admin",
    icon: <IoIcons.IoMdPeople />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Manage Schedule",
    path: "/mngSchedule",
    icon: <FaIcons.FaList />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },

  {
  title: "Notification",
  icon: <IoIcons.IoMdNotifications />,
  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,

  subNav: [
    {
      title: 'Pending',
      path: '/pendingnotif',
      icon: <IoIcons.IoIosPaper />
    },
    {
      title: 'Accepted',
      path: '/acceptnotif',
      icon: <IoIcons.IoIosPaper />
    },
    {
      title: 'Declined',
      path: '/declinednotif',
      icon: <IoIcons.IoIosPaper />
    }
  ]
  },

  // Updated AdminSidebarData
{
    title: 'Archives',

    icon: <LiaIcons.LiaArchiveSolid />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Subject Archives',
        path: '/subjectarchives',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Schedules Archives',
        path: '/schedulearchives',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Account Archives',
        path: '/accountarchives',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },


  {
    title: "Logout",
    path: "/",
    icon: <FaIcons.FaSignOutAlt />,
    cName: "nav-text",
   

  },
];
