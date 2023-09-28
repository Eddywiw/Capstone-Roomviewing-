import React, { useState,useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import './Users.css'
import {db} from '../config/firestore'
function Professor() {
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
  


  return (
    <div className='use-div'>
      <div className='table-container'>
       
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Id</th>
              <th>Position</th>
              <th>Email</th>
              <th>Action</th> 
            </tr>
          </thead>
          <tbody>
            {
            profs.map((user, index) => (
              <tr key={index}>
                <td>{user.Name}</td>
                <td>{user.Id}</td>
                <td>{user.Position}</td>
                <td>{user.Email}</td>
                <td>
                  <div className='button-div'>
                  <button className='editbtn'>Edit</button>
                    <button className='deletebtn'>Delete</button>
                  </div>
                </td>
                
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      
     
      
    </div>
  )
}

export default Professor