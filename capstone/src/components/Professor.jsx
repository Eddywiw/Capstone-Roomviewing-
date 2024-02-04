import React, { useState,useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc, addDoc } from "firebase/firestore";
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import './Users.css'
import {db} from '../config/firestore'
import CreateProfessor from './CreateProfessor';
import UpdateProfessor from './UpdateProfessor';
import * as XLSX from 'xlsx';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
function Professor() {
  const [currentProf, setCurrentProf] = useState(null);
  const [profs, setProfs] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [existingStudents, setExistingStudents] = useState([]); 
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const [selectedUsers, setSelectedUsers] = useState([]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  useEffect(() => {
    // Fetch existing students on component mount
    getExistingStudents();
  }, []);

  const getExistingStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'professor'));
      const existingStudentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExistingStudents(existingStudentsData);
    } catch (error) {
      console.error("Error fetching existing students: ", error);
    }
  };
  const getProf = async () =>{
    const querySnapshot = await getDocs(collection(db, "professor"));
    const profs = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    setProfs(profs)
    
  }
  useEffect(() =>{
    getProf()
  }, [profs]);
  const handleStudentAdded = (newProfesor) => {
    setUsers((prevUsers) => [...prevUsers, newProfesor]);
  };
  const [users, setUsers] = useState([]);
  const getProfessor = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'professor'));
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() =>{
    getProfessor()
  }, [users]);
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const handleAddBtnClick = () => {
    event.preventDefault();
    setShowModal(true);
  };
  const handleCloseModals = () => {
    setShowModal(false);
  };

  const handleDeleteBtnClick = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this User?");
  
    if (confirmDelete) {
      try {
        // Get the user data before deletion
        const userToDelete = users.find((user) => user.id === userId);
  
        // Add the user data to the "AccountArchives" collection
        await addDoc(collection(db, 'AccountArchives'), userToDelete);
  
        // Delete the user from the original collection
        await deleteDoc(doc(db, 'professor', userId));
  
        // Update the state to remove the deleted user from the table
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const [showUpdateForm, setShowUpdateForm] = useState(false); // State to control the modal
  const handleUpdateBtnClick = (user) => {
    setCurrentProf(user);
    setShowUpdateForm(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdateForm(false);
  };
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const fileName = file.name.toLowerCase(); // Convert file name to lowercase for case-insensitive comparison
  
        if (fileName === 'professor_list.xlsx' || fileName === 'professor_list.xls') {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
  
          // Now you have jsonData with the Excel data, you can add it to Firestore and update your state.
          await addDataToFirestore(jsonData);
  
          // Set the selected file name
          setSelectedFileName(file.name);
        } else {
          // Display an alert if the file name doesn't match the expected format
          alert('Please upload a file for professor list.');
        }
      };
  
      reader.readAsArrayBuffer(file);
    }
  };
  
  const addDataToFirestore = async (jsonData) => {
    let usersAdded = false; // Flag to check if any user has been added
  
    for (const row of jsonData) {
      try {
        // Check if the account already exists
        const existingStudent = existingStudents.find((professor) => professor.ProfessorID === row.ProfessorID);
  
        if (!existingStudent) {
          // Add the new account to Firestore
          const docRef = await addDoc(collection(db, 'professor'), {
            Name: row.Name,
            ProfessorID: row.ProfessorID,
            Position: row.Position,
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

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      // If all users are already selected, clear the selection
      setSelectedUsers([]);
    } else {
      // Otherwise, select all users
      setSelectedUsers(users.map((user) => user.id));
    }
  };
  
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      // If the user is already selected, remove them from the selection
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      // Otherwise, add the user to the selection
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      // If no users are selected, display an alert
      alert("Please select users to delete.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete the selected users?");
  
    if (confirmDelete) {
      try {
        // Loop through selected users and delete each one
        for (const userId of selectedUsers) {
          // Get the user data before deletion
          const userToDelete = users.find((user) => user.id === userId);
  
          // Add the user data to the "AccountArchives" collection
          await addDoc(collection(db, 'AccountArchives'), userToDelete);
  
          // Delete the user from the original collection
          await deleteDoc(doc(db, 'professor', userId));
        }
  
        // Update the state to remove the deleted users from the table
        setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.id)));
  
        // Clear the selected users after deletion
        setSelectedUsers([]);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };
  
  return (
    <div className='use-div'>
      <div className='table-container'>
        <div className='drop-add-con'>
        <div className='addbtn-container'>
          <button className='addbtn' onClick={handleAddBtnClick}>Add +</button>
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
              <th className='thconuser'>
                <div className='deleteallcon'>
                <Button onClick={handleDeleteSelected}>Delete Selected</Button>
                </div>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Professor ID</th>
              <th>Position</th>
              <th>Email</th>
              <th>Password</th> 
             
            </tr>
          </thead>
          <tbody>
            {
            profs.map((user, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>{user.Name}</td>
                <td>{user.ProfessorID}</td>
                <td>{user.Position}</td>
                <td>{user.Email}</td>
                <td className='tdconuser' onClick={togglePasswordVisibility}> {showPassword ? user.Password : user.Password.replace(/./g, '*')}</td>
                <td>
                  <div className='d-flex justify-content-center'>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id={`dropdown-${user.id}`}>                      
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
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
      {showModal && <CreateProfessor onClose={handleCloseModals} onStudentAdded={handleStudentAdded} getProfessor={getProfessor}/>}
      
      {showUpdateForm && currentProf && <UpdateProfessor onClose={handleCloseUpdate} currentProf={currentProf} getProfessor={getProfessor}/>}      
      
    </div>
  )
}

export default Professor