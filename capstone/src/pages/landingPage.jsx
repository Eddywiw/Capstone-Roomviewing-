import circleImage from '../assets/ict.jpg';
import logo from '../assets/logologo.png';
import Modelsti from '../assets/stimodel.png';
import './landingPage.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
      
function LandingPage() {
  const [text, setText] = useState('');
  const [texts, setTexts] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fullText = "Room Viewing makes it easy and fun to";
  const fullTexts = "find your favorite room.";
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, null, window.location.pathname);
    };

    preventBack(); // Call initially to set the initial state

    const handleUnload = () => {
      // You can add cleanup logic here if needed
    };

    window.addEventListener('popstate', preventBack);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('popstate', preventBack);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }, []);

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= fullTexts.length) {
        setTexts(fullTexts.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 250);
  }, []);

  const navigate = useNavigate();

  const gradientStyle = {
    backgroundImage: 'linear-gradient(to bottom right, #5FB9E5, #FEF878)',
    height: '100vh',
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
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const [loginError, setLoginError] = useState('');

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    setEmailError('');
    setPasswordError('');
    setLoginError('');

    try {
      if (!email && !password) {
        setEmailError('Email is required');
        setPasswordError('Password is required');
        return;
      }

      if (!email) {
        setEmailError('Email is required');
        return;
      }

      if (!password) {
        setPasswordError('Password is required');
        return;
      }

      if (email === 'admin' && password === 'admin') {
        // Redirect to admin home page
        navigate('/adminhome');
      } //else if (credentials.user) {
        // Redirect to user home page
       // navigate('/home');
      //}
       else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className='parent' style={gradientStyle}>
    <img src={logo} className='logo-img' alt='logo' />
      <div>
        <img src={Modelsti} className='model-img' alt='model' />
      </div>

      <div className='maindiv'>
        <div className="header">
          <h1 className="header-title">View Room <br />anytime,<br />anywhere</h1>
          <div className='sub-container'>
            <p className='sub-header'>{text}</p>
            <p className='sub-header'>{texts}</p>
          </div>
          <form className='login-form' onSubmit={handleLoginFormSubmit}>
            <input className="input" name="email" placeholder="Email" type="text" />
            {emailError && <p className="error-message">{emailError}</p>}
            <input className="input" name="password" placeholder="Password" type="password" />
            {passwordError && <p className="error-message">{passwordError}</p>}
            {loginError && <p className="error-message">{loginError}</p>}
            <div className='buttoncon'>
            <button className='button-confirm' type='submit'>Log in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;