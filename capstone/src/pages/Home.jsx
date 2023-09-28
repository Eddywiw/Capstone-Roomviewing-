import React, { useState, useEffect }  from 'react';
import './Home.css'
import Img from '../assets/img-icon.png'
import {Link} from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { db } from '../config/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, where, query } from 'firebase/firestore';
const Home = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      history.push('/login'); // Redirect to login page if not authenticated
    }
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
 
  // Function to show the form/modal
  const showForm = () => {
    setIsFormVisible(true);
  };

  // Function to hide the form/modal
  const hideForm = () => {
    setIsFormVisible(false);
  };

 

  
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
const [roomEntries, setRoomEntries] = useState([]); // State to store the fetched room data

useEffect(() => {
  // Fetch data from the "rooms" collection in Firebase
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'rooms'));
    const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRoomEntries(roomsData);
  };

  fetchData();
}, []); // Run this effect only once, similar to componentDidMount

  
  const [userName, setUserName] = useState('');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch user's name from Firestore based on their email
      const userQuery = query(
        collection(db, 'bsit'),
        where('Email', '==', user.email)
      );
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserName(userData.Name); // Set the user's name
      }
    }
  });


  
  return (
    <div className='home'>
      <div className='greetings-container'>
        <h1 className='greetings'>Welcome, {userName}!</h1>
      </div>      
      <div className='main-container-of-class-today'>
        <div className='class-today-container'>
          <p className='lbl-classtoday'>Classes for today / Sunday / July 30 2023</p>   
          <Link to="/schedule" className='lbl-view'>View</Link>     
        </div>
        <div className='free-class'>
        <p className='lblched'>No Class Your Schedule Is Free Today. Enjoy!</p>
        </div>
        
      </div>
      <div className='suggested-container'>
        <h4>Suggested Room:</h4>
        <Link to="/room" className='more-btn'>More</Link>
      </div>
      <Carousel responsive={responsive} itemClass="carousel-item" className='carousel-container'>
      {roomEntries.map(entry => (
        <div class="Card">
          <div class="card-image"></div>
          <p class="card-title">Room: {entry.Roomno}</p>
          <p class="card-body">
           Floor: {entry.Floor}
          </p>
          <p className='card-capacity'>Capacity: {entry.Capacity}</p>
          <p className='card-status'>Status: {entry.Status}</p>
          <div className='bookBTN-container'>
            <button onClick={showForm} className='bookBTN'>Book</button>
          </div>          
        </div>
        ))}
          
      
      </Carousel>;
   
      {isFormVisible && (
        <div class="carding">
          <button className="exit-btn" onClick={hideForm}>
            X
          </button>
          <span class="title">Request to Admin</span>
          <form class="form">
            <div class="group">
              <input placeholder="" type="text" required=""/>
              <label for="name">Room no:</label>
            </div>
            <div class="group">
              <input placeholder="" type="date" id="date" name="date" required=""/>
              <label for="date">Date</label>
            </div>
            <div class="group">
              <input placeholder="" type="time" id="time" name="time" required=""/>
              <label for="time">Time</label>
            </div>
            <div class="group">
              <textarea placeholder="" id="comment" name="comment" rows="5" required=""></textarea>
              <label for="comment">Reason</label>
            </div>
            <button>
              <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                   <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
                <span>Send</span>
            </button>
          </form>
        </div>
      
      )}
    
    </div>
  )
};

export default Home;


