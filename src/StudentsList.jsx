import { useEffect, useState } from 'react';
import AttendanceSummary from './AttendanceSummary';
import StudentsCard from './StudentsCard';

function StudentsList() {
    const [students, setStudents] = useState([]);
    // Initialize date state with today's date in YYYY-MM-DD format
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [attendanceStatusMap, setAttendanceStatusMap] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/api/students')
        .then(response => response.json())
        .then(data => setStudents(data))
        .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    

    return (
        <>
        <div>
            
        </div>
        <h2 style={{textAlign: 'center', margin: '20px auto', maxWidth: '600px'}}>Students List</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '10px 0 20px' }}>
            <label htmlFor="date-selector" style={{ fontWeight: 'bold' }}>Date:</label>
            <input
                type="date"
                id="date-selector"
                value={selectedDate}
                onChange={handleDateChange}
            />
        </div>
        <div><AttendanceSummary selectedDate={selectedDate} /></div>


        <div className="students-card" >
            {students.map(student => (
                <StudentsCard
                key={student.reg_no}  // assuming reg_no is unique
                reg_no={student.reg_no}
                name={student.name}
                hostel={student.hostel}
                room_no={student.room_no}
                sra={student.sra}
                selectedDate={selectedDate}
                />
            ))}
        </div>
        </>
    );
}
    

export default StudentsList;
