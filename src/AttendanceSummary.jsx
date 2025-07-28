import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function AttendanceSummary({ selectedDate }) {
    const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);

        fetch(`/api/attendance/summary?date=${selectedDate}`)
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

    const data = [
        { name: 'Present', value: summary.present },
        { name: 'Absent', value: summary.absent }
    ];

    const COLORS = ['#4CAF50', '#F44336']; // green and red

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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PieChart width={600} height={300}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendanceSummary;
