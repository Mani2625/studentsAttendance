import { useState, useEffect } from 'react';


function StudentsCard(props) {
  const [markedStatus, setMarkedStatus] = useState(props.initialStatus);  // initialStatus from DB
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMarkedStatus(props.initialStatus);
  }, [props.initialStatus]);

  const markAttendance = async (status) => {
    if (!props.selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_reg_no: props.reg_no,
          attendance_date: props.selectedDate,
          status
        })
      });

      const result = await response.json();
      if (response.ok) {
        setMarkedStatus(status); // update state to change color
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
  console.log('markedStatus:', markedStatus);


  return (
    <div className="student-card">
      <div className="student-details">
        <p><span>Name:</span> {props.name}</p>
        <p><span>Reg NO:</span> {props.reg_no}</p>
        <p><span>Hostel:</span> {props.hostel}</p>
        <p><span>Room No:</span> {props.room_no}</p>
        <p><span>SRA:</span> {props.sra}</p>
      </div>
      <div className="attendance-actions">
        <button
          className={`Present ${markedStatus === 'Present' ? 'marked' : ''}`}
          disabled={loading}
          onClick={() => markAttendance('Present')}
        >
          Present
        </button>
        <button
          className={`Absent ${markedStatus === 'Absent' ? 'marked' : ''}`}
          disabled={loading}
          onClick={() => markAttendance('Absent')}
        >
          Absent
        </button>
      </div>
    </div>
  );
}

export default StudentsCard;
