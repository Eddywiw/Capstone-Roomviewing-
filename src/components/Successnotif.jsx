import React from 'react'
import './Successnotif.css'

function Successnotif({ message, clearMessage }) {
  return (
    <div className="success-notification">
        <button onClick={clearMessage} className='exitBtn'>X</button>
        <p>{message}</p>
        
      </div>
  )
}

export default Successnotif
  