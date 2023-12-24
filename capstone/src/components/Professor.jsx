import React, { useState,useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import './Users.css'
import {db} from '../config/firestore'
import CreateProfessor from './CreateProfessor';
import UpdateProfessor from './UpdateProfessor';
function Professor() {
  const [currentProf, setCurrentProf] = useState(null);
  const [profs, setProfs] = useState([]);
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
  return (
    <div className='use-div'>
      <div className='table-container'>
        <div className='addbtn-container'>
          <button className='addbtn' onClick={handleAddBtnClick}>Add +</button>
        </div>  
       
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Password</th> 
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
            profs.map((user, index) => (
              <tr key={index}>
                <td>{user.Name}</td>
                <td>{user.Position}</td>
                <td>{user.Email}</td>
                <td>{user.Password}</td>
                <td>
                  <div className='button-div'>
                  <button className='editbtn'onClick={() => handleUpdateBtnClick(user)}>Edit</button>
                  <button className='deletebtn' onClick={() => handleDeleteBtnClick(user.id)}>Delete</button>
                  </div>
                </td>
                
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      {showModal && <CreateProfessor onClose={handleCloseModals} onStudentAdded={handleStudentAdded} getProfessor={getProfessor}/>}
      
      {showUpdateForm && currentProf && <UpdateProfessor onClose={handleCloseUpdate} currentProf={currentProf} getProfessor={getProfessor}/>}      
      
    </div>
  )
}

export default Professor