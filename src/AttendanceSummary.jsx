import { useEffect, useState } from 'react';

function AttendanceSummary({ selectedDate }) {
    const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);

        fetch(`http://localhost:5000/api/attendance/summary?date=${selectedDate}`)
            .then(response => response.json())
            .then(data => {
                setSummary(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching attendance summary:', err);
                setError('Failed to load summary');
                setLoading(false);
            });
    }, [selectedDate]);

    return (
        <div id="summary" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h4>Attendance summary on {selectedDate}</h4>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div>
                    <p>Total Students: {summary.total}</p>
                    <p id="pres">Present: {summary.present}</p>
                    <p id="abs">Absent: {summary.absent}</p>
                </div>
            )}
        </div>
    );
}

export default AttendanceSummary;
