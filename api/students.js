import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const { date } = req.query;

    // If date provided, join with attendance table
    if (date) {
      const [rows] = await connection.query(`
        SELECT s.*, a.status
        FROM students_table s
        LEFT JOIN attendance a
          ON s.reg_no = a.student_reg_no AND a.attendance_date = ?
      `, [date]);
      res.status(200).json(rows);
    } else {
      // Default: just students
      const [rows] = await connection.query('SELECT * FROM students_table');
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    await connection.end();
  }
}
