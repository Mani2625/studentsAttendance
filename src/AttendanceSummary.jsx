import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';

function AttendanceSummary({ selectedDate }) {
    const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);

        fetch(`/api/attendance?type=summary&date=${selectedDate}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch summary');
                }
                return response.json();
            })
            .then(data => {
                setSummary(data);
            })
            .catch(err => {
                console.error('Error fetching attendance summary:', err);
                setError('Failed to load summary');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedDate]);

    const unmarkedCount = summary.total - summary.present - summary.absent;
    const data = [
        { name: 'Present', value: summary.present },
        { name: 'Absent', value: summary.absent },
        { name: 'Unmarked', value: unmarkedCount > 0 ? unmarkedCount : 0 }
    ].filter(p => p.value > 0);

    const COLORS = ['#4CAF50', '#F44336', '#808080']; // green, red, grey

    return (
        <div id="summary" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h4>Attendance summary on {selectedDate}</h4>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <p>Total Students: {summary.total}</p>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
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
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

export default AttendanceSummary;
