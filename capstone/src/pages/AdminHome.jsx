import React, { useState, useEffect, useRef } from 'react';
import ScheduleTBL from '../components/scheduleTBL';
import './AdminHome.css';
import { db } from '../config/firestore';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import Chart from 'chart.js/auto';

function AdminHome() {
  const [totalStudentsBSIT, setTotalStudentsBSIT] = useState(0);
  const [totalStudentsBSBA, setTotalStudentsBSBA] = useState(0);

  useEffect(() => {
    // Create references to the "bsit" and "bsba" collections
    const bsitCollection = collection(db, 'bsit');
    const bsbaCollection = collection(db, 'bsba');

    // Listen for changes in the "bsit" collection
    const unsubscribeBSIT = onSnapshot(bsitCollection, (querySnapshot) => {
      setTotalStudentsBSIT(querySnapshot.size);
    });

    // Listen for changes in the "bsba" collection
    const unsubscribeBSBA = onSnapshot(bsbaCollection, (querySnapshot) => {
      setTotalStudentsBSBA(querySnapshot.size);
    });

    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribeBSIT();
      unsubscribeBSBA();
    };
  }, []);

  const totalStudents = totalStudentsBSIT + totalStudentsBSBA;

  // Create a ref for the chart canvas
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    // Ensure the previous chart instance is destroyed before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a pie chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: ['BSIT', 'BSBA'],
        datasets: [
          {
            data: [totalStudentsBSIT, totalStudentsBSBA],
            backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
          },
        ],
      },
    });
  }, [totalStudentsBSIT, totalStudentsBSBA]);

  return (
    <div className='mainadhome-con'>
      <div className='bgcolor'>
        <div className='lbl_dashboard'>
          <p>My Dashboard</p>
        </div>
        <div className='tota-con'>
          <div className='totalstudents'>            
            <canvas ref={chartRef} className="chart-canvas" />

            <p>Total Students: {totalStudents}</p>
          </div>
          <div className='totalprof'>
            <p>0</p>
            <p>Total Professors</p>
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
