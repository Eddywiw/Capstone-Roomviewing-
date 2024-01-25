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
        await deleteDoc(doc(db, "professor", userId));
        // After successfully deleting the document, update the state to remove the deleted user from the table
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
                <td>{user.Name}</td>
                <td>{user.ProfessorID}</td>
                <td>{user.Position}</td>
                <td>{user.Email}</td>
                <td>{user.Password}</td>
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