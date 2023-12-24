import React, { useState, useEffect, useRef } from 'react';
import ScheduleTBL from '../components/scheduleTBL';
import './AdminHome.css';
import * as IoIcons from "react-icons/io";
import { db } from '../config/firestore';
import {
  QuerySnapshot,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import Chart from 'chart.js/auto';

function AdminHome() {
  const [totalStudentsBSIT, setTotalStudentsBSIT] = useState(0);
  const [totalStudentsBSBA, setTotalStudentsBSBA] = useState(0);
  const [totalStudentsHRS, setTotalStudentsHRS] = useState(0);
  const [totalprof, setTotalprof] = useState(0);
  useEffect(() => {
    // Create references to the "bsit" and "bsba" collections
    const bsitCollection = collection(db, 'bsit');
    const bsbaCollection = collection(db, 'bsba');
    const hrsCollection = collection(db, 'hrs');
    const profCollection = collection(db, 'professor')
    // Listen for changes in the "bsit" collection
    const unsubscribeProf = onSnapshot(profCollection, (querySnapshot) =>{
      setTotalprof(querySnapshot.size);
    })
    const unsubscribeBSIT = onSnapshot(bsitCollection, (querySnapshot) => {
      setTotalStudentsBSIT(querySnapshot.size);
    });

    // Listen for changes in the "bsba" collection
    const unsubscribeBSBA = onSnapshot(bsbaCollection, (querySnapshot) => {
      setTotalStudentsBSBA(querySnapshot.size);
    });

    const unsubscribeHRS= onSnapshot(hrsCollection, (querySnapshot) => {
      setTotalStudentsHRS(querySnapshot.size);
    });

    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribeProf();
      unsubscribeBSIT();
      unsubscribeBSBA();
      unsubscribeHRS();
    };
  }, []);

  const totalStudents = totalStudentsBSIT + totalStudentsBSBA + totalStudentsHRS;


 

  return (
    <div className='mainadhome-con'>
      <div className='bgcolor'>
        <div className='lbl_dashboard'>
          <p>My Dashboard</p>
        </div>
        <div className='tota-con'>
          
          <div className='courses'>
            <p>BSIT: {totalStudentsBSIT}</p>
            <p>BSBA: {totalStudentsBSBA}</p>
            <p>HRS: {totalStudentsHRS}</p>

          </div>

          <div className='strands'>
            <p>GAS: </p>
            <p>ABM: </p>
            <p>MAWD: </p>
            <p>CULART: </p>
          </div>

          <div className='totalstudents'>
            <div className='totalstu_lbl'>
              <p>Total Students: {totalStudents}</p>
            </div>
            <div className='icon-totalstu'>
            <IoIcons.IoMdPeople className="icon-people1" />
            </div>
          </div>
          <div className='totalprof'>
            <div className='totalprof_lbl'>
              <p>Total Professors: {totalprof}</p>
            </div>
            <div className='icon-totalprof'>
            <IoIcons.IoMdPeople className="icon-people" />
            </div>
            
          </div>
        </div>
        <div className="schedule-con">
          <ScheduleTBL />
        </div>
      </div>
    
    </div>
  );
}

export default AdminHome;
