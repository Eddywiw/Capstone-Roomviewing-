import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
import * as XLSX from 'xlsx';


function StudentTable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'attendance'));
        const attendanceList = [];
        querySnapshot.forEach((doc) => {
          attendanceList.push({ id: doc.id, ...doc.data() });
        });
        setAttendanceData(attendanceList);
        // Initialize attendance status with defaults (both present and absent are false)
        const initialStatus = {};
        attendanceList.forEach((student) => {
          initialStatus[student.id] = {
            present: false,
            absent: false,
          };
        });
        setAttendanceStatus(initialStatus);
      } catch (error) {
        console.error('Error fetching attendance data: ', error);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleCheckboxChange = async (studentId, type) => {
    // Create a reference to the Firestore document for the student
    const studentRef = doc(db, 'attendance', studentId);
    
    // Update the student's attendance status in Firestore
    await updateDoc(studentRef, {
      [type]: !attendanceStatus[studentId][type],
    });

    // Update the local state to reflect the change
    setAttendanceStatus({
      ...attendanceStatus,
      [studentId]: {
        ...attendanceStatus[studentId],
        [type]: !attendanceStatus[studentId][type],
      },
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AttendanceData');

    // Generate the Excel file
    XLSX.writeFile(workbook, 'attendance_data.xlsx');
  };


  return (
    <div>
    <h2>Attendance Table</h2>
    <button onClick={exportToExcel}>Export to Excel</button>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Student No</th>
          <th>Present</th>
          <th>Absent</th>
        </tr>
      </thead>
      <tbody>
        {attendanceData.map((student) => (
          <tr key={student.id}>
            <td>{student.Name}</td>
            <td>{student.Studentno}</td>
            <td>
              <input
                type="checkbox"
                checked={attendanceStatus[student.id]?.present || false}
                onChange={() => handleCheckboxChange(student.id, 'present')}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={attendanceStatus[student.id]?.absent || false}
                onChange={() => handleCheckboxChange(student.id, 'absent')}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

export default StudentTable;
