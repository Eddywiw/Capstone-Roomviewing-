import React, { useState, useEffect }  from 'react';
import './Home.css'
import Img from '../assets/img-icon.png'
import {Link} from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { db } from '../config/firestore';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  where,
  query,
  addDoc,
} from 'firebase/firestore';
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

  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [bookingData, setBookingData] = useState({
    roomNumber: '',
    date: '',
    time: '',
    reason: '',
  });
  

  const handleBookingSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true); // Set isSubmitting to true while submitting
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        teacherName: userName,
        roomNumber: bookingData.roomNumber,
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason,
      });

      setBookingData({
        roomNumber: '',
        date: '',
        time: '',
        reason: '',
      });
      setIsFormVisible(false);
      setIsSubmitting(false);
    } catch (error) {
      // Handle errors and set isSubmitting to false in case of an error
      console.error('Error adding document: ', error);
      setIsSubmitting(false);
    }
  };


  
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
        <div key={entry.id} class="Card">
          <div className='card-image' style={{ backgroundImage: `url(${entry.ImageUrl})` }}></div>
          <p className="card-title">Room: {entry.Roomno}</p>
          <p className="card-body">
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
        <div className="carding">
          <button className="exit-btn" onClick={hideForm}>
            X
          </button>
          <span className="title">Request to Admin</span>
          <form className="form" onSubmit={handleBookingSubmit}>
          <div className='group'>
              <input
                placeholder='Room No'
                type='text'
                required
                value={bookingData.roomNumber}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    roomNumber: e.target.value,
                  })
                }
              />
              <label for='name'>Room no:</label>
            </div>
            <div className='group'>
              <input
                placeholder='Date'
                type='date'
                id='date'
                name='date'
                required
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    date: e.target.value,
                  })
                }
              />
              <label for='date'>Date</label>
            </div>
            <div className='group'>
              <input
                placeholder='Time'
                type='time'
                id='time'
                name='time'
                required
                value={bookingData.time}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    time: e.target.value,
                  })
                }
              />
              <label for='time'>Time</label>
            </div>
            <div className='group'>
              <textarea
                placeholder='Reason'
                id='comment'
                name='comment'
                rows='5'
                required=''
                value={bookingData.reason}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    reason: e.target.value,
                  })
                }
              ></textarea>
              <label for='comment'>Reason</label>
            </div>
            <button type="submit" disabled={isSubmitting}>Submit
              
            </button>
          </form>
        </div>
      
      )}
    
    </div>
  )
};

export default Home;


