import { useEffect, useState } from 'react';

function StudentsCard(props) {
    const [markedStatus, setMarkedStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMarkedStatus(null); // reset when date changes
    }, [props.selectedDate]);
    useEffect(() => {
        if (!props.selectedDate) return;

        fetch(`http://localhost:5000/api/attendance/status?student_reg_no=${props.reg_no}&date=${props.selectedDate}`)
            .then(response => response.json())
            .then(data => {
                setMarkedStatus(data.status); // 'Present', 'Absent' or null
            })
            .catch(err => {
                console.error('Error fetching attendance status:', err);
            });
    }, [props.selectedDate, props.reg_no]);

    const markAttendance = async (status) => {
        if (!props.selectedDate) {
            alert("Please select a date first.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_reg_no: props.reg_no,
                    attendance_date: props.selectedDate,
                    status: status,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(`Successfully marked ${props.name} as ${status}`);
                setMarkedStatus(status);
            } else {
                console.error('Failed to mark attendance:', result.error);
                alert('Failed to mark attendance.');
            }
        } catch (error) {
            console.error('Error sending attendance data:', error);
            alert('Error marking attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-card">
            <p className="element">Name: {props.name}</p>
            <p className="element">Reg NO: {props.reg_no}</p>
            <p className="element">Hostel: {props.hostel}</p>
            <p className="element">Room No: {props.room_no}</p>
            <p className="element">SRA: {props.sra}</p>
            <button
                className={`Present ${markedStatus === 'Present' ? 'marked present' : ''} ${loading ? 'loading' : ''}`}
                onClick={() => markAttendance('Present')}
                disabled={loading}
            >
                {loading && markedStatus === null ? 'Marking...' : 'Present'}
            </button>
            <button
                className={`Absent ${markedStatus === 'Absent' ? 'marked absent' : ''} ${loading ? 'loading' : ''}`}
                onClick={() => markAttendance('Absent')}
                disabled={loading}
            >
                {loading && markedStatus === null ? 'Marking...' : 'Absent'}
            </button>
        </div>
    );
}

export default StudentsCard;
