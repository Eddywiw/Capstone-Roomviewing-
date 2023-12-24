import React, { useState, useEffect }  from 'react';
import './Home.css'
import Img from '../assets/img-icon.png'
import {Link} from 'react-router-dom';
import Calendar from '../components/calendar';
import Carousel from "react-multi-carousel";
import Successnotif from '../components/Successnotif';
import "react-multi-carousel/lib/styles.css";
import RoomSched from '../components/RoomSched';
import { db } from '../config/firestore';
import NotificationUser from '../components/NotificationUser';
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
  orderBy,
  limit
} from 'firebase/firestore';
const Home = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      history.push('/login'); // Redirect to login page if not authenticated
    }
  });

  const [successMessage, setSuccessMessage] = useState('');

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };


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
    // Fetch user's name from Firestore based on their email (for 'bsit' account)
    const bsitUserQuery = query(
      collection(db, 'bsit'),
      where('Email', '==', user.email)
    );

    const bsbaUserQuery = query(
      collection(db, 'bsba'),
      where('Email', '==', user.email)
    );

    const professorUserQuery = query(
      collection(db, 'professor'),
      where('Email', '==', user.email)
    );

    const [bsitQuerySnapshot, bsbaQuerySnapshot, professorQuerySnapshot] = await Promise.all([
      getDocs(bsitUserQuery),
      getDocs(bsbaUserQuery),
      getDocs(professorUserQuery),
    ]);

    if (!bsitQuerySnapshot.empty) {
      const userData = bsitQuerySnapshot.docs[0].data();
      setUserName(userData.Name);
    } else if (!bsbaQuerySnapshot.empty) {
      const userData = bsbaQuerySnapshot.docs[0].data();
      setUserName(userData.Name);
    } else if (!professorQuerySnapshot.empty) {
      const userData = professorQuerySnapshot.docs[0].data();
      setUserName(userData.Name);
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

      setSuccessMessage('Booking request submitted successfully');
      setIsFormVisible(false);
      setIsSubmitting(false);
      
      
    } catch (error) {
      // Handle errors and set isSubmitting to false in case of an error
      console.error('Error adding document: ', error);
      setIsSubmitting(false);
    }
  };

  const [currentSchedule, setCurrentSchedule] = useState(null);
  useEffect(() => {
    const fetchCurrentSchedule = async () => {
      const user = auth.currentUser;
  
      if (user) {
        const scheduleQuery = query(
          collection(db, 'schedules'),
          where('Title', '==', userName), // Assuming userName contains the user's username
          orderBy('Start', 'asc'),
          limit(1)
        );
  
        const scheduleSnapshot = await getDocs(scheduleQuery);
  
        if (!scheduleSnapshot.empty) {
          const scheduleData = scheduleSnapshot.docs[0].data();
          setCurrentSchedule(scheduleData);
        } else {
          setCurrentSchedule(null);
        }
      }
    };
  
    fetchCurrentSchedule();
  }, [auth.currentUser, userName]);
  

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Fetch schedules for each room
      const fetchSchedulesPromises = roomsData.map(async (room) => {
        const schedulesQuery = query(
          collection(db, 'schedules'),
          where('Roomno', '==', room.Roomno)
        );
        const schedulesSnapshot = await getDocs(schedulesQuery);
        const schedulesData = schedulesSnapshot.docs.map(doc => doc.data());
  
        // Extract section information from schedules
        const sectionInfo = schedulesData.map(schedule => schedule.Section);
        
        return {
          ...room,
          schedules: schedulesData,
          section: sectionInfo.length > 0 ? sectionInfo.join(', ') : 'N/A', // Display 'N/A' if no sections found
        };
      });
  
      const roomsWithSchedules = await Promise.all(fetchSchedulesPromises);
      setRoomEntries(roomsWithSchedules);
    };
  
    fetchData();
  }, []);
  
  


  const [roomsked, setRoomsked] = useState(false);
  const [currentRoomNumber, setCurrentRoomNumber] = useState('');
  const showRoomsked = async (roomNumber) => {
    setRoomsked(true);
    setCurrentRoomNumber(roomNumber);
  
    // Fetch schedules for the selected room
    const schedulesQuery = query(
      collection(db, 'schedules'),
      where('Roomno', '==', roomNumber)
    );
  
    const querySnapshot = await getDocs(schedulesQuery);
    const schedulesData = querySnapshot.docs.map(doc => doc.data());
  
    setRoomEntries(roomEntries.map(entry => {
      if (entry.Roomno === roomNumber) {
        return {
          ...entry,
          schedules: schedulesData,
        };
      }
      return entry;
    }));
  };
  

  // Function to hide the form/modal
  const hideRoomsked = () => {
    setRoomsked(false);
  };

  const isRoomAvailable = (schedules) => {
    if (!schedules || schedules.length === 0) {
      return true; // No schedules, room is available
    }
  
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
  
    for (const schedule of schedules) {
      const startTime = schedule.Start.toDate().getTime();
      const endTime = schedule.End.toDate().getTime();
  
      if (currentTime >= startTime && currentTime <= endTime) {
        return false; // Room is booked during this time
      }
    }
  
    return true; // No overlapping schedules, room is available
  };
  
 
  

  
  return (
    <div className='home'>
      <div className='greetings-container'>
        <h1 className='greetings'>Welcome, {userName}!</h1>
      </div>      
      <div className='main-container-of-class-today'>
        <div className='class-today-container'>
          {currentSchedule ? (
            <p className='lbl-classtoday'>
              Class for today: {currentSchedule.Title} /{' '} {currentSchedule.Start.toDate().toLocaleDateString()}
            </p>
            
          ) : (
            <p className='lbl-classtoday'>No classes for today</p>
          )}
          <Link to="/schedule" className='lbl-view'>
            View
          </Link>
        </div>
       
        {currentSchedule ? ( // Add conditional rendering for Professor, Start time, and End time
          <div className='lbl_Sched'>
            <p>Professor: {currentSchedule.Professor}</p>
            <p>Start time: {currentSchedule.Start.toDate().toLocaleTimeString()}</p>
            <p>End time: {currentSchedule.End.toDate().toLocaleTimeString()}</p>
          </div>
        ) : null}
      </div>
      <div className='suggested-container'>
        <h4>Suggested Room:</h4>
        <Link to="/room" className='more-btn'>More</Link>
      </div>
      <Carousel className='carousel-container' responsive={responsive} itemClass="carousel-item" >
      {roomEntries.map(entry => (
        <div key={entry.id} class="Card">
          <div onClick={() => showRoomsked(entry.Roomno)} className='card-image' style={{ backgroundImage: `url(${entry.ImageUrl})` }}></div>
          <p className="card-title">Room: {entry.Roomno}</p>
          <p className="card-body">
           Floor: {entry.Floor}
          </p>
          <p className='card-body'>Section: {entry.section}</p>
          <p className='card-capacity'>Capacity: {entry.Capacity}</p>
          <p className='card-status'>
            Status: {isRoomAvailable(entry.schedules) ? 'Available' : 'Not Available'}
          </p>
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
      {successMessage && (
            <Successnotif
              message={successMessage}
              clearMessage={clearSuccessMessage}
            />
          )}

      {roomsked && (
        <RoomSched onclose={hideRoomsked} currentRoomNumber={currentRoomNumber} />

      )}    
      
    

    
    </div>
  )
};

export default Home;


