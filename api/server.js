import cors from 'cors';
import express from 'express';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

// DB config
const db = mysql.createConnection({
    host:     'b4ozvvutfyl9t3hag2y8-mysql.services.clever-cloud.com',
    user:     'urul8dh9kv1rbpsg',
    password: 'xxGTXWHfaSblpgmGurcN',
    database: 'b4ozvvutfyl9t3hag2y8',
    port:     3306,
    ssl: { rejectUnauthorized: false }
});

// Get all students
app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM students_table', (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Mark attendance
app.post('/api/attendance', (req, res) => {
    const { student_reg_no, attendance_date, status } = req.body;
    if (!student_reg_no || !attendance_date || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const query = `
        INSERT INTO attendance (student_reg_no, attendance_date, status)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE status = ?
    `;
    const values = [student_reg_no, attendance_date, status, status];
    db.query(query, values, (err) => {
        if (err) {
            console.error('Error marking attendance:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: `Attendance marked for ${student_reg_no}` });
    });
});

// Attendance summary for a date
app.get('/api/attendance/summary', (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date query parameter is required' });

    const summaryQuery = `
        SELECT
            (SELECT COUNT(*) FROM students_table) as total,
            (SELECT COUNT(*) FROM attendance WHERE attendance_date = ? AND status = 'Present') as present,
            (SELECT COUNT(*) FROM attendance WHERE attendance_date = ? AND status = 'Absent') as absent
    `;
    db.query(summaryQuery, [date, date], (err, results) => {
        if (err) {
            console.error('Error fetching attendance summary:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results[0] || { total: 0, present: 0, absent: 0 });
    });
});

// Get attendance status of *all* students for a date (for filter)
app.get('/api/attendance/status', (req, res) => {
    const { student_reg_no, date } = req.query;

    if (!student_reg_no || !date) {
        return res.status(400).json({ error: 'Missing student_reg_no or date' });
    }

    const query = `SELECT status FROM attendance WHERE student_reg_no = ? AND attendance_date = ?`;

    db.query(query, [student_reg_no, date], (err, results) => {
        if (err) {
            console.error('Error fetching attendance status:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.json({ status: results[0].status });
        } else {
            res.json({ status: null });
        }
    });
});


// Add new student
app.post('/api/students', (req, res) => {
    const { reg_no, name, hostel, room_no, sra } = req.body;
    if (!reg_no || !name || !hostel || !room_no || !sra) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const query = `
        INSERT INTO students_table (reg_no, name, hostel, room_no, sra)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [reg_no, name, hostel, room_no, sra], (err) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: `Student ${name} added!` });
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('API is running!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// Get list of students marked 'Present' on a specific date
app.get('/api/attendance/present', (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: 'Missing date parameter' });
    }

    const query = `
        SELECT s.* 
        FROM students_table s
        JOIN attendance a ON s.reg_no = a.student_reg_no
        WHERE a.attendance_date = ? AND a.status = 'Present'
    `;

    db.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error fetching present students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/attendance/absent', (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Missing date parameter' });

    const query = `
        SELECT s.* 
        FROM students_table s
        JOIN attendance a ON s.reg_no = a.student_reg_no
        WHERE a.attendance_date = ? AND a.status = 'Absent'
    `;
    db.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error fetching absent students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});
