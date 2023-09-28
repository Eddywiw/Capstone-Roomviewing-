import React, { useState,useEffect } from 'react';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import InsertEvent from './InsertEvent';
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import './Users.css'
import {db} from '../config/firestore'
function Users() {
    //
    const [selectedOption, setSelectedOption] = useState('');
  
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
  const getStudent = async () =>{
    const querySnapshot = await getDocs(collection(db, "bsit"));
    const users = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    setUsers(users)
    
  }
  useEffect(() =>{
    getStudent()
  }, [users]);
  

  const [showModal, setShowModal] = useState(false); // State to control the modal
 
  const handleDeleteBtnClick = async (userId) => {
    try {
      await deleteDoc(doc(db, "bsit", userId));
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
      <div>
      <select value={selectedOption} onChange={handleDropdownChange}>
        <option value="">Select an section</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
     
      </div>
        <div className='addbtn-container'>
        <button className='addbtn' onClick={handleAddBtnClick}>Add +</button>
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
                    <button>View</button>
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
      
     
      {showUpdateForm && currentUser && <UpdateUser onClose={handleCloseUpdate} currentStudent={currentUser}/>}
      {showInsertForm && currentUser && (
        <div className="form-container">
          <InsertEvent onClose={handleCloseModal} onEventAdded={handleEventAdded} eventList={eventList} setEventList={setEventList}  currentStudent={currentUser}/>
        </div>
      )}
      {/* Pass the handleStudentAdded function to CreateUser */}
      {showModal && <CreateUser onClose={handleCloseModals} onStudentAdded={handleStudentAdded} getStudent={getStudent} />}

      {currentUser && <Calendar currentStudent={currentUser} />}
    </div>
  );
}

export default Users;
