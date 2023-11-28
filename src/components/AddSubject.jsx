import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firestore';
import './AddSubject.css'
function AddSubject() {
    const [newSubject, setNewSubject] = useState({
        subjectname: ""
    });
      const handleChange = (event) => {
        const { name, value } = event.target;
        setNewSubject({ ...newSubject, [name]: value });
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          // Get the user's ID from the selected user (currentUser)
          
      
          // Create a new document in the "schedules" collection with the user's ID
          const docRef = await addDoc(collection(db, "subject"), {
            Subjectname: newSubject.subjectname
          });
      
       
      
          console.log("Document written with ID: ", docRef.id);
      
          // Close the CreateUser modal after successful addition
         
      
          // Clear the form inputs after successful addition
          setNewSubject({
            subjectname: ""
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      };
  return (
    <div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="subjectname"
            value={newSubject.subjectname}
            onChange={handleChange}
            required
          />
          <label htmlFor="subject">Subject:</label>
        </div>
        <button onClick={handleSubmit}>Add Subject</button>
    </div>
  )
}

export default AddSubject