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
import Schedulemodal from './Schedulemodal';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
function Users() {
  const [existingStudents, setExistingStudents] = useState([]); 
  useEffect(() => {
    // Fetch existing students on component mount
    getExistingStudents();
  }, []);

  const getExistingStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, selectedCourse));
      const existingStudentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExistingStudents(existingStudentsData);
    } catch (error) {
      console.error("Error fetching existing students: ", error);
    }
  };
  const [showScheduleModal, setShowScheduleModal] = useState(false); // State to control the schedule modal
  const handleSelectSchedule = async (schedule) => {
    try {
      console.log('Current User:', currentUser);
      console.log('Schedule Details:', schedule);
      if (currentUser && currentUser.id && currentUser.Name) {
        // Ensure currentUser is not null and has both 'id' and 'Name' properties
        await addDoc(collection(db, 'irregularSchedule'), {
          userName: currentUser.Name, // Use userName instead of userId
          ...schedule, // Directly spread the properties of scheduleDetails
        });
        // Close the schedule modal
        setShowScheduleModal(false);
      } else {
        console.error('Invalid currentUser:', currentUser);
      }
    } catch (error) {
      console.error('Error adding irregular schedule: ', error);
    }
  };
  
  
  
  const handleAddIrregularSubject = (user) => {
    setCurrentUser(user);
    setShowScheduleModal(true);
  };
  
  const handleclosekoto = () => {
    setShowScheduleModal(false);
  }
    //bago to
    const [selectedCourse, setSelectedCourse] = useState('bsit'); // Initialize with 'bsit' 
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [enrollment, setEnrollment] = useState('all');
    
    const options = [
      { value: 'bsit', label: 'BSIT' },
      { value: 'bsba', label: 'BSBA' },
      { value: 'hrs', label: 'HRS' },
      { value: 'gas', label: 'GAS' },
      { value: 'abm', label: 'ABM' },
      { value: 'mawd', label: 'MAWD' },
      { value: 'culart', label: 'CULART' },
    ];

    const enrollmentoptions = [
      { value: 'all', label: 'All' },
      { value: 'Regular', label: 'Regular' },
      { value: 'Irregular', label: 'Irregular' },
      
    ];

    // Define a mapping of courses to their respective year options
    const courseYearOptions = {
      bsit: [
        { value: 'all', label: 'All' },
        { value: 'BSIT 41-A', label: 'BSIT 41-A' },
        { value: 'BSIT 31-A', label: 'BSIT 31-A' },
        { value: 'BSIT 21-A', label: 'BSIT 21-A' },
        { value: 'BSIT 11-A', label: 'BSIT 11-A' },
      ],
      bsba: [
        { value: 'all', label: 'All' },
        { value: 'BSBA 41-A', label: 'BSBA 41-A' },
        { value: 'BSBA 31-A', label: 'BSBA 31-A' },
        { value: 'BSBA 21-A', label: 'BSBA 21-A' },
        { value: 'BSBA 11-A', label: 'BSBA 11-A' },
      ],
      hrs: [
        { value: 'all', label: 'All' },
        { value: 'HRS 11-A', label: 'HRS 11-A' },
        { value: 'HRS 21-A', label: 'HRS 21-A' },
      ],
    };
      // Use the selected course to get the corresponding year options
    const selectedYearOptions = courseYearOptions[selectedCourse] || [];

    const handleCourseChange = (event) => {
      setSelectedCourse(event.target.value);
    };


    const handleYearChange = (event) => {
      setSelectedYear(event.target.value);
    };
    
  
    const handleEnrollmentChange = (event) => {
      setEnrollment(event.target.value);
    };

    const handleExcelUpload = async (event) => {
      const file = event.target.files[0];
    
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
    
          // Now you have jsonData with the Excel data, you can add it to Firestore and update your state.
          await addDataToFirestore(jsonData);
    
          // Set the selected file name
          setSelectedFileName(file.name);
        };
    
        reader.readAsArrayBuffer(file);
      }
    };
    
    const addDataToFirestore = async (jsonData) => {
      let usersAdded = false; // Flag to check if any user has been added
    
      for (const row of jsonData) {
        try {
          // Check if the account already exists
          const existingStudent = existingStudents.find((student) => student.Studentno === row.Studentno);
    
          if (!existingStudent) {
            // Add the new account to Firestore
            const docRef = await addDoc(collection(db, selectedCourse), {
              EnrollmentStatus: row.EnrollmentStatus,
              Name: row.Name,
              Studentno: row.Studentno,
              Course: row.Program,
              Section: row.Section,
              Email: row.Email,
              Password: row.Password,
            });
    
            // Update the state with the new account
            setUsers((prevUsers) => [...prevUsers, { id: docRef.id, ...row }]);
            
            usersAdded = true; // Set the flag to true since at least one user has been added
          }
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      }
    
      // Show alert if no user has been added
      if (!usersAdded) {
        alert('All users in the Excel file already exist in the table.');
      }
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
      const querySnapshot = await getDocs(collection(db, selectedCourse));
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
        await deleteDoc(doc(db, selectedCourse, userId));
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
        <div className='dropdowntwo'>
        <div className='addbtn-container'>
          <button className='addbtn' onClick={handleAddBtnClick}>Add +</button>
          </div>  
        <div className='dropdown-con'>
          <select value={selectedCourse} onChange={handleCourseChange}>
          {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </select>
        </div>
        <div className='dropdown-con'>
            <select value={selectedYear} onChange={handleYearChange}>
              {selectedYearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className='dropdown-con'>
            <select value={enrollment} onChange={handleEnrollmentChange}>
              {enrollmentoptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div> 


          
          </div>
          <div className='file-input-container'>
            <input
              type='file'
              accept='.xls,.xlsx'
              id='fileInput'
              className='form-control'
              onChange={handleExcelUpload}
            />
            {selectedFileName && <span className='file-name'>{selectedFileName}</span>}
          </div>

      </div>  
      
      <Table striped bordered hover>
          <thead>
            <tr>
              <th>Enrollment Status</th>
              <th>Name</th>
              <th>Student no.</th>
              <th>Program</th>
              <th>Section</th>
              <th>Email</th>
              <th>Password</th>
            
            </tr>
          </thead>
          <tbody>
            {
            users
            .filter((user) =>{
                // Check if the selected enrollment status is 'all' or matches the user's enrollment status
                return (
              (enrollment === 'all' || user.EnrollmentStatus === enrollment) &&
              (selectedYear === 'all' || user.Section === selectedYear)
            );
            })
            .map((user, index) => (
              <tr key={index}>
                <td>{user.EnrollmentStatus}</td>
                <td>{user.Name}</td>
                <td>{user.Studentno}</td>
                <td>{user.Course}</td>
                <td>{user.Section}</td>
                <td>{user.Email}</td>
                <td>{user.Password}</td>
                <td>
                  <div className='d-flex justify-content-center'>
                    {/* Conditionally render the Add Irregular Subject button for Irregular users */}
                 
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id={`dropdown-${user.id}`}>
                      
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {user.EnrollmentStatus === 'Irregular' && (
                          <Dropdown.Item onClick={() => handleAddIrregularSubject(user)}>Add Subject</Dropdown.Item>                     
                        )}
                        <Dropdown.Item onClick={() => handleDeleteBtnClick(user.id)}>Remove</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleUpdateBtnClick(user)}>Edit</Dropdown.Item>
                        {/* Add additional menu items as needed */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </td>

                
              </tr>
            ))
            }
          </tbody>
        </Table>




      </div>

      
     
      {showUpdateForm && currentUser && <UpdateUser onClose={handleCloseUpdate} currentStudent={currentUser} section={selectedCourse} getStudent={getStudent}/>}
      {showInsertForm && currentUser && (
          <div className="form-container">
            <InsertEvent
              eventList={eventList}
              setEventList={setEventList}
              currentStudent={currentUser}
            />
          </div>
        )}

      {/* Pass the handleStudentAdded function to CreateUser */}
      {showModal && <CreateUser onClose={handleCloseModals} currentStudent={currentUser} onStudentAdded={handleStudentAdded} newstu={existingStudents} getStudent={getStudent} section={selectedCourse}/>}
      
      {showScheduleModal && currentUser && (
          <Schedulemodal
            onClose={handleclosekoto}
            onSelectSchedule={handleSelectSchedule}
            currentUser={currentUser}
          />
        )}

      
    </div>
  );
}

export default Users;
