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
import { addDoc } from 'firebase/firestore';
import Calendar from './calendar';
import StudentTable from './StudentTable';
import * as XLSX from 'xlsx';

function Users() {
  
    //bago to
    const [selectedSection, setSelectedSection] = useState('bsit'); // Initialize with 'bsit' 
  
    const options = [
      { value: 'BSIT', label: 'BSIT' },
      { value: 'BSBA', label: 'BSBA' },
      { value: 'HRS', label: 'HRS' },
    ];
    const handleExcelUpload = (event) => {
      const file = event.target.files[0];
    
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
    
          // Now you have jsonData with the Excel data, you can add it to Firestore and update your state.
          addDataToFirestore(jsonData);
        };
    
        reader.readAsArrayBuffer(file);
      }
    };
    
    const addDataToFirestore = (jsonData) => {
      jsonData.forEach(async (row) => {
        try {
          // Log the data before adding it to Firestore to identify any issues
          console.log("Adding data to Firestore:", row);
    
          const docRef = await addDoc(collection(db, selectedSection), {
            EnrollmentStatus: row.EnrollmentStatus, 
            Name: row.Name,
            Studentno: row.Studentno,
            Section: row.Section,
            Email: row.Email,
            Password: row.Password,
          });
    
          // Update the state to reflect the newly added user
          setUsers((prevUsers) => [...prevUsers, { id: docRef.id, ...row }]);
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      });
    };
        
  
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
    const confirmDelete = window.confirm("Are you sure you want to delete this User?");
    
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, selectedSection, userId));
        // After successfully deleting the document, update the state to remove the deleted user from the table
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
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
              <th>Enrollment Status</th>
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
                <td>{user.EnrollmentStatus}</td>
                <td>{user.Name}</td>
                <td>{user.Studentno}</td>
                <td>{user.Section}</td>
                <td>{user.Email}</td>
                <td>{user.Password}</td>
                <td>
                  <div className='button-div'>

                    <button onClick={() => handleUpdateBtnClick(user)} className='editbtn'>Edit</button>
                    <button onClick={() => handleDeleteBtnClick(user.id)} className='deletebtn'>Delete</button>
                  </div>
                </td>
                
              </tr>
            ))
            }
          </tbody>
        </table>
        <input type="file" accept=".xls,.xlsx" onChange={handleExcelUpload} />



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
