import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
};

export default async function handler(req, res) {
  const db = await mysql.createConnection(dbConfig);

  if (req.method === 'POST') {
    const { student_reg_no, attendance_date, status } = req.body;
    if (!student_reg_no || !attendance_date || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      await db.query(
        `INSERT INTO attendance (student_reg_no, attendance_date, status)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?`,
        [student_reg_no, attendance_date, status, status]
      );
      res.status(200).json({ success: true, message: `Attendance marked for ${student_reg_no}` });
    } catch (err) {
      console.error('Error marking attendance:', err);
      res.status(500).json({ error: 'Database error' });
    }

  } else if (req.method === 'GET') {
    const { date, student_reg_no, type } = req.query;

    if (type === 'summary' && date) {
      try {
        const [rows] = await db.query(`
          SELECT
            (SELECT COUNT(*) FROM students_table) as total,
            (SELECT COUNT(*) FROM attendance WHERE attendance_date = ? AND status = 'Present') as present,
            (SELECT COUNT(*) FROM attendance WHERE attendance_date = ? AND status = 'Absent') as absent
        `, [date, date]);
        res.status(200).json(rows[0]);
      } catch (err) {
        console.error('Error fetching summary:', err);
        res.status(500).json({ error: 'Database error' });
      }
    } else if (type === 'status' && date && student_reg_no) {
      try {
        const [rows] = await db.query(
          'SELECT status FROM attendance WHERE student_reg_no = ? AND attendance_date = ?',
          [student_reg_no, date]
        );
        res.status(200).json({ status: rows.length > 0 ? rows[0].status : null });
      } catch (err) {
        console.error('Error fetching status:', err);
        res.status(500).json({ error: 'Database error' });
      }
    } else if (type === 'present' && date) {
      try {
        const [rows] = await db.query(`
          SELECT s.* 
          FROM students_table s
          JOIN attendance a ON s.reg_no = a.student_reg_no
          WHERE a.attendance_date = ? AND a.status = 'Present'
        `, [date]);
        res.status(200).json(rows);
      } catch (err) {
        console.error('Error fetching present:', err);
        res.status(500).json({ error: 'Database error' });
      }
    } else if (type === 'absent' && date) {
      try {
        const [rows] = await db.query(`
          SELECT s.* 
          FROM students_table s
          JOIN attendance a ON s.reg_no = a.student_reg_no
          WHERE a.attendance_date = ? AND a.status = 'Absent'
        `, [date]);
        res.status(200).json(rows);
      } catch (err) {
        console.error('Error fetching absent:', err);
        res.status(500).json({ error: 'Database error' });
      }
    } else {
      res.status(400).json({ error: 'Invalid or missing parameters' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  await db.end();
}
