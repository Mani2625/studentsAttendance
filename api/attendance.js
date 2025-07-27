// routes/attendance.js
import express from 'express';

const router = express.Router();

export default (db) => {

  // Mark attendance
  router.post('/', (req, res) => {
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

  // Attendance summary
  router.get('/summary', (req, res) => {
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

  // Status for specific student and date
  router.get('/status', (req, res) => {
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

  // List of students marked Present
  router.get('/present', (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Missing date parameter' });

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

  // List of students marked Absent
  router.get('/absent', (req, res) => {
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

  return router;
};
