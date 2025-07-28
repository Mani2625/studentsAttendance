import mysql from 'mysql2/promise';

// Create a pool so it can be reused across calls
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { method, query, body } = req;

  try {
    if (method === 'GET') {
      const { type, date, student_reg_no } = query;

      if (type === 'summary' && date) {
        const [rows] = await pool.query(
          `SELECT
             (SELECT COUNT(*) FROM students_table) as total,
             (SELECT COUNT(*) FROM attendance WHERE attendance_date = ? AND status = 'Present') as present,
             (SELECT COUNT(*) FROM attendance WHERE attendance_date = ? AND status = 'Absent') as absent
          `, [date, date]
        );
        return res.status(200).json(rows[0]);
      }

      if (type === 'status' && student_reg_no && date) {
        const [rows] = await pool.query(
          'SELECT status FROM attendance WHERE student_reg_no = ? AND attendance_date = ?',
          [student_reg_no, date]
        );
        return res.status(200).json({ status: rows[0]?.status ?? null });
      }

      if (type === 'present' && date) {
        const [rows] = await pool.query(
          `SELECT s.* 
           FROM students_table s
           JOIN attendance a ON s.reg_no = a.student_reg_no
           WHERE a.attendance_date = ? AND a.status = 'Present'`,
          [date]
        );
        return res.status(200).json(rows);
      }

      if (type === 'absent' && date) {
        const [rows] = await pool.query(
          `SELECT s.* 
           FROM students_table s
           JOIN attendance a ON s.reg_no = a.student_reg_no
           WHERE a.attendance_date = ? AND a.status = 'Absent'`,
          [date]
        );
        return res.status(200).json(rows);
      }

      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    if (method === 'POST') {
      const { student_reg_no, attendance_date, status } = body;
      if (!student_reg_no || !attendance_date || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      await pool.query(
        `INSERT INTO attendance (student_reg_no, attendance_date, status)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?`,
        [student_reg_no, attendance_date, status, status]
      );
      return res.status(200).json({ success: true, message: `Attendance marked for ${student_reg_no}` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('DB error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}
