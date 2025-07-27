// routes/students.js
import express from 'express';

const router = express.Router();

export default (db) => {

  // Get all students
  router.get('/', (req, res) => {
    db.query('SELECT * FROM students_table', (err, results) => {
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });

  // Add new student
  router.post('/', (req, res) => {
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

  return router;
};
