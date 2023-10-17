import React,{useState, useEffect} from 'react'
import Img from '../assets/img-icon.png'
import './Room.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';
function Room() {
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
  return (
    <div className='Room-main-container' style={responsive}>
        <div responsive={responsive} className='filter-container'>
         <div class="card-filter">          
          <button className='filter-btn' >All</button>
        </div> 
        <div class="card-filter">          
          <button className='filter-btn' >1st Floor</button>
        </div>
        <div class="card-filter">          
          <button className='filter-btn' >2nd Floor</button>
        </div>
        <div class="card-filter">          
          <button className='filter-btn' >3rd Floor</button>
        </div>
        <div class="card-filter">          
          <button className='filter-btn' >30 sitters</button>
        </div>
        </div>
      <div className='roomdiv'>
      {roomEntries.map(entry => (
         <div className='Card'>
         <div className='card-image' style={{ backgroundImage: `url(${entry.ImageUrl})` }}>
           {/* Display the image */}
         </div>
         <p className='card-title'>Room: {entry.Roomno}</p>                 
         <p className='card-body'>Floor: {entry.Floor}</p>
         <p className='card-capacity'>Capacity: {entry.Capacity}</p>
                                      
         <p className='card-status'>Status: {entry.Status}</p>
         <div className='bookBTN-container'>
            <button className='bookBTN'>Book</button>
          </div>   
       </div>
        ))}          
      </div>

        
        
        
        
        
    
    </div>
  )
}

export default Room

