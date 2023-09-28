import circleImage from '../assets/ict.jpg';
import logo from '../assets/logonew.png';
import Modelsti from '../assets/stimodel.png'
import './landingPage.css';
import {Link, useNavigate} from 'react-router-dom';
import React, {useState} from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
function landingPage() {
  const navigate = useNavigate();
    const gradientStyle = {
        backgroundImage: 'linear-gradient(to bottom right, #5FB9E5, #FEF878)',
        height: '100vh', // Set some height to see the gradient better
      };
    
      const circleContainerStyle = {
        position: 'absolute',
        right: '0',
        margin: '100px',  
      };
    
      const circleStyle = {
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        overflow: 'hidden', // Ensure the image doesn't overflow outside the circle
      };
    
      const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Preserve the aspect ratio and fill the entire circle
      };
      const handleLoginFormSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
      
        try {
          if (email === 'admin' && password === 'admin') {
            // Redirect to admin home page
            navigate('/adminhome');
          } else {
            // Regular authentication process
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to user home page
            navigate('/home');
          }
        } catch (error) {
          console.error("Login error:", error.message);
        }
      };
      
  return (
    <div className='parent' style={gradientStyle}>
        <img src={logo} className='logo' alt='logo' />
        <div>
          <img src={Modelsti} className='model-img' alt='model' />
        </div>
        
        <div className='maindiv'>
          <header className="header">
            <h1 className="header-title">View Room <br />anytime,<br />anywhere</h1>
            <div className='sub-container'>
            <p className='sub-header'>Room Viewing makes it easy and fun to find your <br></br>favorite room.</p>
            </div>
            
          </header>
          <form className='login-form' onSubmit={handleLoginFormSubmit}>
            <input className="input" name="email" placeholder="Email" type="text" />
            <input className="input" name="password" placeholder="Password" type="password"  />
            <button className='button-confirm' type='submit'>Log in</button>
          </form>
        </div>
    </div>
  )
}

export default landingPage



  