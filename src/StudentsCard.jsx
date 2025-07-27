import { useEffect, useState } from 'react';

function StudentsCard(props) {
    const [markedStatus, setMarkedStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!props.selectedDate) return;

        async function fetchStatus() {
            try {
                const res = await fetch(`api/attendance/status?student_reg_no=${props.reg_no}&date=${props.selectedDate}`);
                const data = await res.json();
                setMarkedStatus(data.status); // status from DB
            } catch (error) {
                console.error('Error fetching attendance status:', error);
            }
        }

        fetchStatus();
    }, [props.selectedDate, props.reg_no]);

    const markAttendance = async (status) => {
        if (!props.selectedDate) {
            alert("Please select a date first.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_reg_no: props.reg_no,
                    attendance_date: props.selectedDate,
                    status,
                }),
            });
            if (response.ok) {
                setMarkedStatus(status); // update UI
            } else {
                const result = await response.json();
                console.error('Failed:', result.error);
                alert('Failed to mark attendance.');
            }
        } catch (error) {
            console.error('Error:', error);
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
                Present
            </button>
            <button
                className={`Absent ${markedStatus === 'Absent' ? 'marked absent' : ''} ${loading ? 'loading' : ''}`}
                onClick={() => markAttendance('Absent')}
                disabled={loading}
            >
                Absent
            </button>
        </div>
    );
}

export default StudentsCard;
