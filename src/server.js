import cors from 'cors';
import express from 'express';
import mysql from 'mysql2';

const app = express();
app.use(cors());

// ✅ add this line to parse JSON bodies!
app.use(express.json());

// Replace these values with your actual DB credentials
const db = mysql.createConnection({
    host:     'b4ozvvutfyl9t3hag2y8-mysql.services.clever-cloud.com',
    user:     'urul8dh9kv1rbpsg',
    password: 'xxGTXWHfaSblpgmGurcN',
    database: 'b4ozvvutfyl9t3hag2y8',
    port:     3306,
    ssl: { rejectUnauthorized: false } // Clever Cloud requires SSL
});

// Route to get students list
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students_table', (err, results) => {
        if (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Database error' });
        } else {
        res.json(results);
        }
    });
});

app.post('/api/attendance', (req, res) => {
    console.log('Request body:', req.body);  // ✅ for debug

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

    db.query(query, values, (err, result) => {
        if (err) {
        console.error('Error marking attendance:', err);
        return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: `Attendance marked for ${student_reg_no}` });
    });
});


app.get('/', (req, res) => {
  res.send('API is running!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Route to get attendance summary for a specific date
app.get('/api/attendance/summary', (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required' });
    }

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

app.get('/api/attendance/status', (req, res) => {
    const { student_reg_no, date } = req.query;

    if (!student_reg_no || !date) {
        return res.status(400).json({ error: 'Missing student_reg_no or date' });
    }

    const query = `
        SELECT status FROM attendance WHERE student_reg_no = ? AND attendance_date = ?
    `;

    db.query(query, [student_reg_no, date], (err, results) => {
        if (err) {
        console.error('Error fetching attendance status:', err);
        return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
        res.json({ status: results[0].status });
        } else {
        res.json({ status: null }); // not yet marked
        }
    });
});

// Route to add new student
app.post('/api/students', (req, res) => {
    const { reg_no, name, hostel, room_no, sra } = req.body;

    if (!reg_no || !name || !hostel || !room_no || !sra) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO students_table (reg_no, name, hostel, room_no, sra)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [reg_no, name, hostel, room_no, sra], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: `Student ${name} added!` });
    });
});



