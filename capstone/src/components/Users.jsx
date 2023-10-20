import React, { useState,useEffect } from 'react';
import Home from '../pages/Home';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import InsertEvent from './InsertEvent';
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import './Users.css'
import NotificationForm from './Notification';
import {db} from '../config/firestore'

import Calendar from './calendar';
import StudentTable from './StudentTable';
function Users() {
    //bago to
    const [selectedSection, setSelectedSection] = useState('bsit'); // Initialize with 'bsit' 
  
    const options = [
      { value: 'BSIT', label: 'BSIT' },
      { value: 'BSBA', label: 'BSBA' },
      { value: 'HRS', label: 'HRS' },
    ];
  
    const handleDropdownChange = (event) => {
      setSelectedOption(event.target.value);
    };
    //
  const [currentUser, setCurrentUser] = useState(null);
  const handleStudentAdded = (newStudent) => {
    setUsers((prevUsers) => [...prevUsers, newStudent]);
  };
  const [users, setUsers] = useState([]);
  const getStudent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, selectedSection));
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() =>{
    getStudent()
  }, [users]);
  

  const [showModal, setShowModal] = useState(false); // State to control the modal
 
  const handleDeleteBtnClick = async (userId) => {
    try {
      await deleteDoc(doc(db, selectedSection, userId));
      // After successfully deleting the document, update the state to remove the deleted user from the table
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleAddBtnClick = () => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModals = () => {
    setShowModal(false);
  };
  const [showUpdateForm, setShowUpdateForm] = useState(false); // State to control the modal

  const handleUpdateBtnClick = (user) => {
    setCurrentUser(user);
    setShowUpdateForm(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdateForm(false);
  };

  const [showInsertForm, setShowInsertForm] = useState(false);
  const [eventList, setEventList] = useState([]);

  const handleAddEvent = (user) => {
    setCurrentUser(user);
    setShowInsertForm(true);
  };

  const handleCloseModal = () => {
    setShowInsertForm(false);
  };
  const handleEventAdded = (newEvent) => {
    setEventList(prevEvents => [...prevEvents, newEvent]);
  };
  return (
    <div className='use-div'>

      <div className='table-container'>
      <div className='drop-add-con'>
        <div className='dropdown-con'>
          <select value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)}>
          <option value="bsit">BSIT</option>
          <option value="bsba">BSBA</option>
          <option value="hrs">HRS</option>
        </select>
      
        </div>
          <div className='addbtn-container'>
          <button className='addbtn' onClick={handleAddBtnClick}>Add +</button>
          </div>  
      </div>  
      
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student no.</th>
              <th>Section</th>
              <th>Email</th>
              <th>Password</th>
              <th>Action</th> 
            </tr>
          </thead>
          <tbody>
            {
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.Name}</td>
                <td>{user.Studentno}</td>
                <td>{user.Section}</td>
                <td>{user.Email}</td>
                <td>{user.Password}</td>
                <td>
                  <div className='button-div'>
                    <button onClick={() => handleAddEvent(user)}>Assign</button>
                    <button onClick={() => handleUpdateBtnClick(user)} className='editbtn'>Edit</button>
                    <button onClick={() => handleDeleteBtnClick(user.id)} className='deletebtn'>Delete</button>
                  </div>
                </td>
                
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      
     
      {showUpdateForm && currentUser && <UpdateUser onClose={handleCloseUpdate} currentStudent={currentUser} section={selectedSection} getStudent={getStudent}/>}
      {showInsertForm && currentUser && (
        <div className="form-container">
          <InsertEvent onClose={handleCloseModal} onEventAdded={handleEventAdded} eventList={eventList} setEventList={setEventList}  currentStudent={currentUser}/>
        </div>
      )}
      {/* Pass the handleStudentAdded function to CreateUser */}
      {showModal && <CreateUser onClose={handleCloseModals} currentStudent={currentUser} onStudentAdded={handleStudentAdded} getStudent={getStudent} section={selectedSection}/>}
      
      
      
    </div>
  );
}

export default Users;
