import { useState } from 'react'
import './App.css'
import {BrowserRouter, Route, Routes, Outlet} from 'react-router-dom'
import Schedule from './pages/Schedule'
import Home from "./pages/Home";
import Room from "./pages/Room";
import LandingPage from "./pages/landingPage";
import Students from "./pages/Students"
import Navbar from './components/navbar';
import AdminPage from './pages/AdminPage';
import CreateUser from './components/CreateUser';
import AdminNavbar from './components/AdminNavbar'
import AdminHome from './pages/AdminHome';
import ManageRoom from './pages/ManageRoom';
import ManageSubject from './pages/ManageSubject';
import ManageTeacher from './pages/ManageTeacher';
import ManageSchedule from './pages/ManageSchedule'
import AdminNotification from './pages/AdminNotification';
import Archive from './pages/Archive';
import SubjectArchives from './components/SubjectArchives';
import NotificationArchives from './components/NotificationArchives';
import Pending from './components/Pending';
function App() {
  const AppLayout = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );
  const AppLayoutAdmin = () => (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );

  return (
   <div>
    <BrowserRouter>
      <Routes>
      <Route path="/" exact element={<LandingPage/>}/>
      
      </Routes>
      <Routes>
        <Route element={<AppLayout />}>
         <Route path="/home" element={<Home />} />
         <Route path="/room" element={<Room />} />
         <Route path="/schedule" element={<Schedule />} />
         <Route path="/Students" element={<Students />} />
        </Route>
      </Routes>
      <Routes>
        <Route element={<AppLayoutAdmin />}>
         <Route path="/adminhome" element={<AdminHome/>}/>
         <Route path="/manageroom" element={<ManageRoom/>}/>
         <Route path="/managesubject" element={<ManageSubject/>}/>
         <Route path="/mngteacher" element={<ManageTeacher/>}/>
         <Route path="/mngSchedule" element={<ManageSchedule/>}/>
         <Route path="/AdminNotification" element={<AdminNotification/>}/>
         <Route path="/admin" element={<AdminPage/>}/>
         <Route path="/archives" element={<Archive/>}/>
         <Route path="/subjectarchives" element={<SubjectArchives/>}/>
         <Route path="/notificationarchives" element={<NotificationArchives/>}/>
         <Route path="/pendingnotif" element={<Pending/>}/>
        </Route>
      </Routes>
      <Routes>
        
        <Route path="/adduser" element={<CreateUser/>}/>
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
