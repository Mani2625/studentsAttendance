import { useEffect, useState } from 'react';
import AttendanceSummary from './AttendanceSummary';
import StudentsCard from './StudentsCard';

function StudentsList() {
    const [students, setStudents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Present', 'Absent'

    // Fetch all students initially or when filter changes
    useEffect(() => {
        fetchStudents();
    }, [selectedDate, activeFilter]);

    const fetchStudents = () => {
        let url = '';

        if (activeFilter === 'Present') {
            url = `/api/attendance?type=present&date=${selectedDate}`;
        } else if (activeFilter === 'Absent') {
            url = `/api/attendance?type=absent&date=${selectedDate}`;
        } else {
            url = `/api/students?date=${selectedDate}`;

        }

        fetch(url)
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching students:', error));
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setActiveFilter('All'); // reset filter when date changes
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <>
            <h2 style={{ textAlign: 'center', margin: '20px auto', maxWidth: '600px' }}>
                Students List
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <label htmlFor="date-selector" style={{ fontWeight: 'bold' }}>Date:</label>
                <input
                    type="date"
                    id="date-selector"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => handleFilterChange('All')}
                    className={activeFilter === 'All' ? 'filter-active' : ''}
                >
                    All
                </button>
                <button
                    onClick={() => handleFilterChange('Present')}
                    className={activeFilter === 'Present' ? 'filter-active' : ''}
                >
                    Present
                </button>
                <button
                    onClick={() => handleFilterChange('Absent')}
                    className={activeFilter === 'Absent' ? 'filter-active' : ''}
                >
                    Absent
                </button>
            </div>

            <AttendanceSummary selectedDate={selectedDate} />

            <div className="students-card">
                {students.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No students found.</p>
                ) : (
                    students.map(student => (
                        <StudentsCard
                            key={student.reg_no}
                            reg_no={student.reg_no}
                            name={student.name}
                            hostel={student.hostel}
                            room_no={student.room_no}
                            sra={student.sra}
                            selectedDate={selectedDate}
                            initialStatus={student.status}
                        />
                    ))
                )}
            </div>
        </>
    );
}

export default StudentsList;
