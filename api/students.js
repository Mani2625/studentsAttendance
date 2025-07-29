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
  try {
    if (req.method === 'POST') {
      const studentsData = req.body;

      // Handle bulk insert if body is an array
      if (Array.isArray(studentsData)) {
        if (studentsData.length === 0) {
          return res.status(400).json({ error: 'No student data provided for bulk insert.' });
        }
        const values = studentsData.map(s => [s.reg_no, s.name, s.hostel, s.room_no, s.sra]);
        const [result] = await pool.query(
          'INSERT INTO students_table (reg_no, name, hostel, room_no, sra) VALUES ?',
          [values]
        );
        return res.status(201).json({ message: `${result.affectedRows} students added successfully.` });
      }

      // Handle single student insert
      const { reg_no, name, hostel, room_no, sra } = studentsData;
      if (!reg_no || !name || !hostel || !room_no || !sra) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      await pool.query(
        'INSERT INTO students_table (reg_no, name, hostel, room_no, sra) VALUES (?, ?, ?, ?, ?)',
        [reg_no, name, hostel, room_no, sra]
      );
      return res.status(201).json({ message: 'Student added successfully.' });

    } else if (req.method === 'GET') {
      const { date } = req.query;

      // If date provided, join with attendance table
      if (date) {
        const [rows] = await pool.query(`
          SELECT s.*, a.status
          FROM students_table s
          LEFT JOIN attendance a
            ON s.reg_no = a.student_reg_no AND a.attendance_date = ?
        `, [date]);
        return res.status(200).json(rows);
      }
      // Default: just students
      const [rows] = await pool.query('SELECT * FROM students_table');
      return res.status(200).json(rows);

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A student with this registration number already exists.' });
    }
    return res.status(500).json({ error: 'Database error' });
  }
}
